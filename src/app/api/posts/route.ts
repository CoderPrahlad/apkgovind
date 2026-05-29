import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/posts - List all posts
export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: posts, count: posts.length });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts. Ensure MySQL is connected." },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, published, authorId } = body;

    if (!title || !authorId) {
      return NextResponse.json(
        { success: false, error: "Title and authorId are required" },
        { status: 400 }
      );
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        authorId,
      },
      include: { author: true },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
