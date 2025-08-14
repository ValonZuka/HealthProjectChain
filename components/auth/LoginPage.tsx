"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface LoginPageProps {
  role: "doctor" | "nurse" | "patient";
}

export default function LoginPage({ role }: LoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); // for doctor/nurse only

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = { email, password };
    if (role === "doctor" || role === "nurse") {
      payload.token = token;
    }

    try {
      const res = await fetch(`/api/auth/${role}-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Invalid credentials");
      }

      toast({ title: "Login successful", description: `Welcome, ${role}!` });

      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", email);

      if (role === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 capitalize">{role} Login</h1>

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {(role === "doctor" || role === "nurse") && (
          <div className="mb-4">
            <Label htmlFor="token">Access Token</Label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
