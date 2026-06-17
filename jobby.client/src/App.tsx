import LandingPage from "@/components/auth/Landing";
import { LoginPage } from "@/components/auth/Login";
import { RegisterPage } from "@/components/auth/Register";
import EventCalendar from "@/components/calendar/EventCalendar";
import Layout from "@/components/layout/Layout";
import { ProtectedRoute } from "@/ProtectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ArchivedApps from "@/components/archive/Archive";
import { KanbanBoard } from "@/components/dashboard/Kanban";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage  /> } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>              
                        <Route path="/dashboard" element={<KanbanBoard />} />      
                        <Route path="/calendar" element={<EventCalendar />} />
                            <Route path="/archive" element={<ArchivedApps />} />                    
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}