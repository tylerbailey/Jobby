import * as React from "react"
import { Link, useNavigate } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/AuthContext"

const data = {
    navMain: [
        {
            title: "Main",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "/",
                    isActive: true
                },  
                {
                    title: "Resume",
                    url: "/resume",
                    isActive: false
                },
            ],
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const navigate = useNavigate();
    const { setUser } = useUser();
    function logout() {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
         navigate("/login");
    }
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
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <Link to={item.url}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <button type="button" onClick={logout}>
                    Log out
                </button>
            </SidebarFooter>        
            <SidebarRail />

        </Sidebar>
    )
}
