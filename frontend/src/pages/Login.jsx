import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { Card, Spinner } from "../components/ui.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <h1 className="text-h3 mb-1">Welcome back</h1>
        <p className="text-text-muted text-sm mb-6">Log in to your CodeFootPrint account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2">
            {isLoading && <Spinner />}
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create Account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
