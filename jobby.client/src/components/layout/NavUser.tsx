import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

/** Renders the current user's account menu in the sidebar footer. */
export function NavUser() {
    const navigate = useNavigate();
    const context = useAuth();

    /** Logs the user out and redirects to the landing page. */
    function handleLogout() {
        context.logout();
        navigate("/");
    }

    /** Navigates to the user's profile page. */
    function handleProfileClick() {
        navigate("/profile");
    }

    if (!context.user)
        return null;

    return (
        <div className="flex w-full items-center gap-1">
            <SidebarMenuButton size="lg" className="pointer-events-none flex-1 opacity-100">
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                        {context.user.displayName || context.user.email}
                    </span>
                    {context.user.displayName && (
                        <span className="truncate text-xs text-muted-foreground">
                            {context.user.email}
                        </span>
                    )}
                </div>
            </SidebarMenuButton>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open account menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleProfileClick}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
