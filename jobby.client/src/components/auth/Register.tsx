import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    getAuthErrorMessage,
    hasFieldErrors,
    validateRegisterForm,
    type RegisterFieldErrors,
} from "@/helpers/authHelpers";
import { CircleAlert } from "lucide-react";
import { useAuth } from "@/context/authContext";

export function RegisterPage() {
    const navigate = useNavigate();
    const context = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function clearFieldError(field: keyof RegisterFieldErrors) {
        if (fieldErrors[field] || formError) {
            setFieldErrors((current) => ({ ...current, [field]: undefined }));
            setFormError(null);
        }
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);

        const validationErrors = validateRegisterForm(displayName, email, password);
        setFieldErrors(validationErrors);

        if (hasFieldErrors(validationErrors))
            return;

        setIsSubmitting(true);
        try {
            await context.register(email.trim(), password, displayName.trim());
            navigate("/login", { state: { registered: true } });
        } catch (err) {
            setFormError(getAuthErrorMessage(err, "Could not create account. Please try again."));
        } finally {
            setIsSubmitting(false);
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
                        <form id="register-form" onSubmit={handleSubmit}>
                            <FieldGroup>
                                {formError && (
                                    <Alert variant="destructive">
                                        <CircleAlert />
                                        <AlertTitle>Registration failed</AlertTitle>
                                        <AlertDescription>{formError}</AlertDescription>
                                    </Alert>
                                )}
                                <Field data-invalid={!!fieldErrors.displayName}>
                                    <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => {
                                            setDisplayName(e.target.value);
                                            clearFieldError("displayName");
                                        }}
                                        type="text"
                                        autoComplete="name"
                                        disabled={isSubmitting}
                                        aria-invalid={!!fieldErrors.displayName}
                                    />
                                    <FieldError>{fieldErrors.displayName}</FieldError>
                                </Field>
                                <Field data-invalid={!!fieldErrors.email}>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            clearFieldError("email");
                                        }}
                                        placeholder="m@example.com"
                                        autoComplete="email"
                                        disabled={isSubmitting}
                                        aria-invalid={!!fieldErrors.email}
                                    />
                                    <FieldError>{fieldErrors.email}</FieldError>
                                </Field>
                                <Field data-invalid={!!fieldErrors.password}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            clearFieldError("password");
                                        }}
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                        aria-invalid={!!fieldErrors.password}
                                    />
                                    <FieldDescription>
                                        At least 8 characters with one uppercase letter and one number.
                                    </FieldDescription>
                                    <FieldError>{fieldErrors.password}</FieldError>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" form="register-form" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create"}
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
