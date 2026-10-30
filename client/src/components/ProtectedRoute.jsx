import { Navigate } from "react-router-dom";
import { getUser } from "../api.js";

// Blocks pages unless a token exists and the role matches
export default function ProtectedRoute({ role, children }) {
  const user = getUser();
  if (!user || !localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (role && user.type !== role) return <Navigate to={user.type === "admin" ? "/admin" : "/user"} replace />;
  return children;
}
