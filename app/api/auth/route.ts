import { NextResponse } from "next/server";

// In-memory user store for demonstration (replace with a real database like Prisma, Supabase, etc.)
const users: { email: string; password: string; role: string; name?: string; token?: string }[] = [];

// Define valid tokens for doctor and nurse (replace with secure storage in production)
const VALID_TOKEN = "hXL5iocF99";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, role, email, password, name, token } = body;

    // Validate required fields
    if (!action || !role || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["patient", "doctor", "nurse"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    // Validate token for doctor and nurse
    if (role === "doctor" || role === "nurse") {
      if (!token || token !== VALID_TOKEN) {
        return NextResponse.json(
          { success: false, error: "Invalid access token" },
          { status: 401 }
        );
      }
    }

    if (action === "login") {
      // Check if user exists and password matches
      const user = users.find(
        (u) => u.email === email && u.password === password && u.role === role
      );

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Successful login
      return NextResponse.json({ success: true }, { status: 200 });
    } else if (action === "signup") {
      // Check if user already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 400 }
        );
      }

      // Validate name for signup
      if (!name) {
        return NextResponse.json(
          { success: false, error: "Name is required for signup" },
          { status: 400 }
        );
      }

      // Add new user to in-memory store (replace with database logic)
      users.push({ email, password, role, name, token: role === "patient" ? undefined : token });

      // Successful signup
      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}