import { register } from "@/services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function RegisterPage() {
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(email, password, displayName);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Could not create account. Check your email and password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Create account</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="displayName">Display name</label>
                    <input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        type="text"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                        minLength={8}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </main>
    );
}