import ArchivedApps from "@/components/archive/Archive";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LandingPage from "@/components/auth/Landing";
import { LoginPage } from "@/components/auth/Login";
import { RegisterPage } from "@/components/auth/Register";
import EventCalendar from "@/components/calendar/EventCalendar";
import Dashboard from "@/components/dashboard/Dashboard";
import Layout from "@/components/layout/layout";
import { AdminRoute } from "@/AdminRoute";
import { ProtectedRoute } from "@/ProtectedRoute";
import { PublicRoute } from "@/PublicRoute";
import { SessionExpiredNotice } from "@/components/auth/SessionExpiredNotice";
import { AuthProvider } from "@/providers/authProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResumeRating from "./components/resume/ResumeRating";
import ResumeGenerate from "./components/resume/ResumeGenerate";
import ProfilePage from "@/components/profile/ProfilePage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <SessionExpiredNotice />
                <Routes>
                    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/calendar" element={<EventCalendar />} />
                            <Route path="/resumegenerate" element={<ResumeGenerate />} />
                            <Route path="/resumerating" element={<ResumeRating />} />
                            <Route path="/archive" element={<ArchivedApps />} />
                            <Route path="/profile" element={<ProfilePage />} />
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