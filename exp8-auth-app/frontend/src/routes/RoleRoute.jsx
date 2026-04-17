import { Navigate } from "react-router-dom";

export default function RoleRoute({ isAuthenticated, user, allowedRoles, children }) {
  if (!isAuthenticated) return <Navigate to="/" />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" />;
  return children;
}