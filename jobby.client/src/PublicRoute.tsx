import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";

/** Sends an already authenticated visitor to the dashboard. */
export function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isInitialized } = useAuth();

    if (!isInitialized)
        return null;

    if (isLoggedIn)
        return <Navigate to="/dashboard" replace />;

    return children;
}
