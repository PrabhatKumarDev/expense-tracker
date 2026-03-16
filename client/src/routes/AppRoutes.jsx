import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import { isAuthenticated } from "../utils/authStorage";

function AppRoutes() {
  const authenticated = isAuthenticated();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={authenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={!authenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!authenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard"
        element={authenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;