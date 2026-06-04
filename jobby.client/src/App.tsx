import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/components/auth/login";
import { ProtectedRoute } from "@/ProtectedRoute";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { RegisterPage } from "@/components/auth/register";
import Layout from "@/components/layout/layout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />      
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}