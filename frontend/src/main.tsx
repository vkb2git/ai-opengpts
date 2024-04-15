import ReactDOM from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { NotFound } from "./components/NotFound.tsx";
import Login from "./components/Login";
import Register from "./components/Register";

import { LOCAL_STORAGE_NAME } from "./constants";

if (document.cookie.indexOf("user_id") === -1) {
  document.cookie = `opengpts_user_id=${uuidv4()}; path=/; SameSite=Lax`;
}

const queryClient = new QueryClient();

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem(LOCAL_STORAGE_NAME);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/thread/:chatId" element={<RequireAuth><App /></RequireAuth>} />
          <Route
            path="/assistant/:assistantId/edit"
            element={<RequireAuth><App edit={true} /></RequireAuth>}
          />
          <Route path="/assistant/:assistantId" element={<RequireAuth><App /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><App /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);