import { Navigate } from "react-router";
import React from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const role = localStorage.getItem("role");

  return role && allowedRoles.includes(role) ? (
    <>{children}</>
  ) : (
    <Navigate to="/forbidden" replace />
  );
}
