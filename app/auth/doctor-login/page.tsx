"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorLoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    token: "",
    name: "",
    age: "",
    gender: "",
    description: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const VALID_TOKEN = "hXL5iocF99";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic token check client side (optional, backend always checks)
    if ((mode === "login" || mode === "signup") && form.token !== VALID_TOKEN) {
      setError("Invalid access token.");
      setLoading(false);
      return;
    }

    const payload: any = {
      action: mode,
      role: "doctor",
      email: form.email,
      password: form.password,
      token: form.token,
    };

    if (mode === "signup") {
      payload.name = form.name;
      // Age, gender, description optional for doctor signup (you can extend)
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Unknown error");
        setLoading(false);
        return;
      }

      // Save role & email for session (basic)
      localStorage.setItem("role", "doctor");
      localStorage.setItem("userEmail", form.email);

      router.push("/");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Doctor {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          {/* Token required for doctor */}
          <input
            type="text"
            name="token"
            placeholder="Access Token"
            value={form.token}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-700">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setError(null);
              setMode(mode === "login" ? "signup" : "login");
            }}
            className="font-semibold underline hover:text-blue-800"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => router.push("/role-selection")}>
          &larr; Back to Role Selection
        </p>
      </div>
    </div>
  );
}
