import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LOCAL_STORAGE_NAME } from "../constants";

function RegistrationPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    const response = await fetch(`/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        username,
        password,
      }),
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.status === 200) {
      const { message, token } = await response.json();
      if (token) {
        localStorage.setItem(LOCAL_STORAGE_NAME, token);
        navigate("/");
      } else {
        setErrorMessage(message);
      }
    } else if (response.status === 400) {
      const {
        detail: { message },
      } = await response.json();
      setErrorMessage(message || "Invalid registration details.");
    } else {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-1">
              First Name
            </label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setErrorMessage("");
                setFirstName(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-1">
              Last Name
            </label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setErrorMessage("");
                setLastName(e.target.value);
              }}
              required
            />
          </div>
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
            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
            type="submit"
          >
            Register
          </button>
          <Link to="/login" className="text-blue-500">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
