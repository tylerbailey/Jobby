import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export function ProtectedRoute() {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}