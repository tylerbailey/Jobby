import { isLoggedIn } from "@/services/authService";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
    return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}