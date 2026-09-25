import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AUTH_SESSION_EXPIRED_EVENT, SESSION_EXPIRED_MESSAGE } from "@/helpers/authSession";
import { CircleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const NOTICE_MS = 1600;

/** Shows a short session-expired message, then sends the user to the login screen. */
export function SessionExpiredNotice() {
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const dismissRef = useRef<() => void>(() => {});
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useEffect(() => {
        let timer: number | undefined;

        function goToLogin() {
            window.clearTimeout(timer);
            setVisible(false);
            if (window.location.pathname !== "/login")
                navigateRef.current("/login", { replace: true, state: { sessionExpired: true } });
        }

        function onSessionExpired() {
            setVisible(true);
            window.clearTimeout(timer);
            timer = window.setTimeout(goToLogin, NOTICE_MS);
        }

        dismissRef.current = goToLogin;
        window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
        return () => {
            window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
            window.clearTimeout(timer);
        };
    }, []);

    if (!visible)
        return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6">
            <div className="flex w-full max-w-md flex-col gap-4">
                <Alert>
                    <CircleAlert />
                    <AlertTitle>Session expired</AlertTitle>
                    <AlertDescription>{SESSION_EXPIRED_MESSAGE}</AlertDescription>
                </Alert>
                <Button type="button" onClick={() => dismissRef.current()}>
                    Continue to login
                </Button>
            </div>
        </div>
    );
}
