
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export function AdminRoute() {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn)
        return <Navigate to="/" replace />;

    if (!user?.roles?.includes("Admin"))
        return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}
