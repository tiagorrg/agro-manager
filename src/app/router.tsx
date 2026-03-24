import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth";
import Layout from "./layout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MapPage from "../pages/Map";
import FieldDetailPage from "../pages/FieldDetail";
import CalendarPage from "../pages/Calendar";
import ReportsPage from "../pages/Reports";
import FieldsPage from "../pages/Fields";
import OperationsPage from "../pages/Operations";

interface ProtectedRouteProps {
  children: ReactNode;
  variant?: "default" | "fullBleed";
}

function ProtectedRoute({ children, variant }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout variant={variant}>{children}</Layout>;
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
      <Route
        path="/map"
        element={
          <ProtectedRoute variant="fullBleed">
            <MapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fields/:id"
        element={
          <ProtectedRoute>
            <FieldDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fields"
        element={
          <ProtectedRoute>
            <FieldsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operations"
        element={
          <ProtectedRoute>
            <OperationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
