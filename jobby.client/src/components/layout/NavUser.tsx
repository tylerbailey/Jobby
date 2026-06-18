import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export function NavUser() {
    const navigate = useNavigate();
    const context = useAuth();

    function handleLogout() {
        context.logout();
        navigate("/");
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xs">{(context.user.email)}</span>
                    </div>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="center">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


