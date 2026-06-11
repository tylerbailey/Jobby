import { LoginPage } from "@/components/auth/Login";
import { RegisterPage } from "@/components/auth/Register";
import { Dashboard } from "@/components/dashboard/Dashboard";
import Layout from "@/components/layout/Layout";
import { ProtectedRoute } from "@/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EventCalendar from "./components/calendar/EventCalendar";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />      
                        <Route path="/calendar" element={<EventCalendar />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}