import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth";
import Layout from "./layout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function Router() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Будущие маршруты */}
      <Route path="/map"      element={<ProtectedRoute><div>Карта</div></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><div>Календарь</div></ProtectedRoute>} />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
