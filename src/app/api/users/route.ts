import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/users - List all users
export async function GET() {
  try {
    const users = await db.user.findMany({
      include: { posts: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: users, count: users.length });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users. Ensure MySQL is connected." },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: { email, name },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
