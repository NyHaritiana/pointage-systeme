import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  if (!user || !role) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === "employe") return <Navigate to="/calendar" replace />;
    if (role === "admin" || role === "rh") return <Navigate to="/tableau" replace />;
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />; 
}
