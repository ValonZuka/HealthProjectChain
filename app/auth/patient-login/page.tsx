"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientLoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    description: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ✅ Hardcoded login
    if (
      mode === "login" &&
      form.email === "valon@gmail.com" &&
      form.password === "loni12345"
    ) {
      localStorage.setItem("role", "patient");
      localStorage.setItem("userEmail", form.email);
      router.push("/patient/dashboard");
      return;
    }

    const payload: any = {
      action: mode,
      role: "patient",
      email: form.email,
      password: form.password,
    };

    if (mode === "signup") {
      payload.name = form.name;
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

      localStorage.setItem("role", "patient");
      localStorage.setItem("userEmail", form.email);

      router.push("/patient/dashboard");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-cyan-500 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          Patient {mode === "login" ? "Login" : "Sign Up"}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-700">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setError(null);
              setMode(mode === "login" ? "signup" : "login");
            }}
            className="font-semibold underline hover:text-green-800"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>

        <p
          className="mt-4 text-center text-sm text-green-600 cursor-pointer hover:underline"
          onClick={() => router.push("/role-selection")}
        >
          &larr; Back to Role Selection
        </p>
      </div>
    </div>
  );
}
