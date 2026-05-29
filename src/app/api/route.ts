import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api - Health check
export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      message: "MatkaKing API is running",
      database: "MySQL (connected)",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      architecture: "React + Node.js + MySQL",
    });
  } catch (error) {
    return NextResponse.json({
      status: "degraded",
      message: "MatkaKing API is running (database not connected)",
      database: "MySQL (disconnected)",
      timestamp: new Date().toISOString(),
      hint: "Ensure MySQL is running and DATABASE_URL is configured in .env",
    });
  }
}
