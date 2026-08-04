import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";

/** Renders child routes only when the user is authenticated, otherwise redirects to login. */
export function ProtectedRoute() {
    const { isLoggedIn, isInitialized } = useAuth();

    if (!isInitialized)
        return null;

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}