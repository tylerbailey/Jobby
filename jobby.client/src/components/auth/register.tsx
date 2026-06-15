import { register } from "@/services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RegisterPage() {
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit() {
        try {
            await register(email, password, displayName);
            navigate("/login");
        } catch {

            toast.error("Could not create account. Check your email and password.");
        } 
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
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
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Create your account</CardTitle>
                        <CardDescription>
                            Create a new account by entering your information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Display Name</Label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value) }
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline" >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="button" onClick={handleSubmit} className="w-full">
                            Create
                        </Button>
                        <p>
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}