import React from "react";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { NovaProvider } from "./contexts/NovaContext";

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NovaProvider>
          <AppRoutes />
        </NovaProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
