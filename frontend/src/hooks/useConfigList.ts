import { useCallback, useEffect, useReducer } from "react";
import orderBy from "lodash/orderBy";

export interface Config {
  assistant_id: string;
  name: string;
  updated_at: string;
  config: {
    configurable?: {
      tools?: string[];
      [key: string]: unknown;
    };
  };
  public: boolean;
  mine?: boolean;
}

export interface ConfigListProps {
  configs: Config[] | null;
  saveConfig: (
    key: string,
    config: Config["config"],
    files: File[],
    isPublic: boolean,
    assistantId?: string,
  ) => Promise<string>;
}

function configsReducer(
  state: Config[] | null,
  action: Config | Config[],
): Config[] | null {
  state = state ?? [];
  if (!Array.isArray(action)) {
    const newConfig = action;
    action = [
      ...state.filter((c) => c.assistant_id !== newConfig.assistant_id),
      newConfig,
    ];
  }
  return orderBy(action, "updated_at", "desc");
}

export function useConfigList(): ConfigListProps {
  const [configs, setConfigs] = useReducer(configsReducer, null);

  useEffect(() => {
    async function fetchConfigs() {
      const myConfigs = await fetch("/assistants/", {
        headers: {
          Accept: "application/json",
        },
      })
        .then((r) => r.json())
        .then((li) => li.map((c: Config) => ({ ...c, mine: true })));
      setConfigs(myConfigs);
    }

    fetchConfigs();
  }, []);

  const saveConfig = useCallback(
    async (
      name: string,
      config: Config["config"],
      files: File[],
      isPublic: boolean,
      assistantId?: string,
    ): Promise<string> => {
      const confResponse = await fetch(
        assistantId ? `/assistants/${assistantId}` : "/assistants",
        {
          method: assistantId ? "PUT" : "POST",
          body: JSON.stringify({ name, config, public: isPublic }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      const savedConfig = (await confResponse.json()) as Config;
      if (files.length) {
        const assistant_id = savedConfig.assistant_id;
        const formData = files.reduce((formData, file) => {
          formData.append("files", file);
          return formData;
        }, new FormData());
        formData.append(
          "config",
          JSON.stringify({ configurable: { assistant_id } }),
        );
        await fetch(`/ingest`, {
          method: "POST",
          body: formData,
        });
      }
      setConfigs({ ...savedConfig, mine: true });
      return savedConfig.assistant_id;
    },
    [],
  );

  return {
    configs,
    saveConfig,
  };
}
