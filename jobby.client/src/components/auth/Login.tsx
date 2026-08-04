import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getAuthErrorMessage } from "@/helpers/authHelpers"
import { cn } from "@/lib/utils"
import { CircleAlert, CircleCheck } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/authContext"

/** Renders the login form and handles user authentication. */
export function LoginPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const location = useLocation();
    const registered = (location.state as { registered?: boolean } | null)?.registered;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const context = useAuth();

    /** Clears the current form-level error message, if any. */
    function clearError() {
        if (formError)
            setFormError(null);
    }

    /** Validates and submits the login form, then navigates to the dashboard. */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);

        if (!email.trim() || !password) {
            setFormError("Email and password are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            await context.login(email.trim(), password);
            navigate("/dashboard");
        } catch (err) {
            setFormError(getAuthErrorMessage(err, "Login failed. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <div className="flex items-center gap-4 px-4 py-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <span className="text-2xl font-bold">J</span>
                        </div>
                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-600">
                                Jobby
                            </h1>
                            <p className="truncate text-sm text-slate-600">
                                Track every opportunity.
                            </p>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    {registered && (
                                        <Alert>
                                            <CircleCheck />
                                            <AlertTitle>Account created</AlertTitle>
                                            <AlertDescription>
                                                Your account is awaiting admin approval. You can sign in once it has been approved.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    {formError && (
                                        <Alert variant="destructive">
                                            <CircleAlert />
                                            <AlertTitle>Sign in failed</AlertTitle>
                                            <AlertDescription>{formError}</AlertDescription>
                                        </Alert>
                                    )}
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                clearError();
                                            }}
                                            autoComplete="email"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline" >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                clearError();
                                            }}
                                            autoComplete="current-password"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </Field>
                                    <Field>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Signing in..." : "Login"}
                                        </Button>
                                        <FieldDescription className="text-center">
                                            Don't have an account? <Link to="/register">Sign up</Link>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
