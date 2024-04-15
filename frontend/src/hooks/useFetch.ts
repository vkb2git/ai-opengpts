import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_NAME } from "../constants";

export type FetchWithToken = (
  url: string,
  options?: {
    [key: string]: any;
  },
) => Promise<Response>;

export const useFetch = () => {
  const navigate = useNavigate();

  const request = useCallback(
    async (url: string, options: { [key: string]: any } = {}) => {
      // Include token in request headers
      const token = localStorage.getItem(LOCAL_STORAGE_NAME);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options && options.headers ? options.headers : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 403) {
        navigate("/login");
        throw new Error("Unauthenticated - Redirecting to login");
      }

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response;
    },
    [],
  );

  return request;
};
