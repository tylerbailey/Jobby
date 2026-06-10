import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/authContext"
import { cn } from "@/lib/utils"
import { login } from "@/services/authService"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function LoginPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();

    const [error, setError] = useState("");
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        try {
            const response = await login(email, password);
            setUser({
                id: response.id,
                email: response.email,
                displayName: response.displayName ?? ""
            });
            
            localStorage.setItem("user", JSON.stringify({
                id: response.id,
                email: response.email,
                displayName: response.displayName ?? ""
            }));
            localStorage.setItem("token", response.token);
            navigate("/");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message;

                setError(message ?? "Login failed. Please try again.");
                return;
            }
            setError("Login failed. Please try again.");
        }
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <p style={{ color: "red" }}>
                                    {error}
                                </p>
                            )}
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required />
                                    </Field>
                                    <Field>
                                        <Button type="submit">Login</Button>                                     
                                        <FieldDescription className="text-center">
                                            Don&apos;t have an account? <a href="/register">Sign up</a>
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
