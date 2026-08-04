import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

/** Renders the shared app shell with the sidebar and page content outlet. */
export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <main className="bg-background p-6">
                    <Outlet />
                    <Toaster position={"top-right"} richColors={true} />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}