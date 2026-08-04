import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, } from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavUser } from "@/components/layout/NavUser";


const adminNavItems = [
    {
        title: "Admin Dashboard",
        url: "/admin",
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes("Admin") ?? false;

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-3 px-4 py-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <span className="text-lg font-bold">J</span>
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-bold tracking-tight text-slate-600">
                            Jobby
                        </h1>
                        <p className="truncate text-xs text-slate-600">
                            Track every opportunity.
                        </p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key="Dashboard">
                                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                                    <Link to="/dashboard">Dashboard</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="Calendar">
                                <SidebarMenuButton asChild isActive={location.pathname === "/calendar"}>
                                    <Link to="/calendar">Calendar</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="Archives">
                                <SidebarMenuButton asChild isActive={location.pathname === "/archive"}>
                                    <Link to="/archive">Archives</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                           
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Experimental</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key="Resume Tailoring">
                                <SidebarMenuButton asChild isActive={location.pathname === "/resumegenerate"}>
                                    <Link to="/resumegenerate">Resume Tailoring</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="Resume Rating">
                                <SidebarMenuButton asChild isActive={location.pathname === "/resumerating"}>
                                    <Link to="/resumerating">Resume Rating</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem key="Admin Dashboard">
                                    <SidebarMenuButton asChild isActive={location.pathname === "/admin"}>
                                        <Link to="/admin">Admin Dashboard</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}