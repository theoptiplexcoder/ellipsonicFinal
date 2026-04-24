"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiUrl = "http://localhost:3000";
      const res = await axios.post(
        `${apiUrl}/api/v1/auth-user/login`,
        { email, password }
      );

      const { token } = res.data;
      
      if (!token) {
        setError("No token received from server");
        return;
      }

      localStorage.setItem("token", token);
      console.log("Login success");

      router.push("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-6 py-8 border border-border rounded-lg bg-background">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium mb-1.5">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}