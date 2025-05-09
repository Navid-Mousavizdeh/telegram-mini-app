import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { database } from "@/lib";

export async function GET(request: NextRequest) {
  await database.connect();
  try {
    const user = {
      id: request.headers.get("x-user-id"),
      username: request.headers.get("x-user-username"),
      role: request.headers.get("x-user-role"),
    };
    if (!user.id || !user.username || !user.role) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const submissions = await database.getSubmissionsPaginated(
      {
        _id: new ObjectId(user.id),
        username: user.username,
        role: user.role as "admin" | "regular",
      },
      skip,
      limit
    );

    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  } finally {
    await database.close();
  }
}

export async function POST(request: NextRequest) {
  await database.connect();
  try {
    const user = {
      id: request.headers.get("x-user-id"),
      username: request.headers.get("x-user-username"),
      role: request.headers.get("x-user-role"),
    };
    if (!user.id || !user.username || !user.role) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 });
    }

    const { title, description, category, imageUrl } = await request.json();
    if (!title || !description || !category || !imageUrl) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (!["technology", "education", "health", "other"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!/^https?:\/\/\S+$/.test(imageUrl)) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    const submission = await database.createSubmission(
      { title, description, category, imageUrl },
      user.id
    );
    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  } finally {
    await database.close();
  }
}
