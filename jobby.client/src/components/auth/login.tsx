import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { toast } from "sonner"

export function LoginPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const context = useAuth();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await context.login(email, password);
            navigate("/dashboard");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message;

                toast.error(message ?? "Login failed. Please try again.");
                return;
            }
            toast.error("Login failed. Please try again.");
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
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required />
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline" >
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
                                            Don't have an account? <a href="/register">Sign up</a>
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
