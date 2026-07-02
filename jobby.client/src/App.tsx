import ArchivedApps from "@/components/archive/Archive";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LandingPage from "@/components/auth/Landing";
import { LoginPage } from "@/components/auth/login";
import { RegisterPage } from "@/components/auth/register";
import EventCalendar from "@/components/calendar/EventCalendar";
import Dashboard from "@/components/dashboard/Dashboard";
import Layout from "@/components/layout/Layout";
import { AdminRoute } from "@/AdminRoute";
import { ProtectedRoute } from "@/ProtectedRoute";
import { AuthProvider } from "@/providers/authProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResumeRating from "./components/resume/ResumeRating";
import ResumeGenerate from "./components/resume/ResumeGenerate";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/calendar" element={<EventCalendar />} />
                            <Route path="/resumegenerate" element={<ResumeGenerate />} />
                            <Route path="/resumerating" element={<ResumeRating />} />
                            <Route path="/archive" element={<ArchivedApps />} />
                            <Route element={<AdminRoute />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}