import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_NAME } from "../constants";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const { message, token }: { message: string; token: string } = await fetch(
      `/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((r) => r.json());
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_NAME, token);
      navigate("/");
    } else {
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setErrorMessage("");
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setErrorMessage("");
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          {errorMessage && (
            <div className="text-red-600 mb-4">{errorMessage}</div>
          )}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
            type="submit"
          >
            Login
          </button>
          <Link to="/registration" className="text-blue-500">
            Don't have an account? Sign up!
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
