import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "@/services/authService";

export function ProtectedRoute() {
    return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}