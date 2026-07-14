import React from "react";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { NovaProvider } from "./contexts/NovaContext";
import { CareerProvider } from "./contexts/CareerContext";

export default function App() {
  return (
    <AuthProvider>
      <CareerProvider>
        <TaskProvider>
          <NovaProvider>
            <AppRoutes />
          </NovaProvider>
        </TaskProvider>
      </CareerProvider>
    </AuthProvider>
  );
}
