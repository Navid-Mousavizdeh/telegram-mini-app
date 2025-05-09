import { database } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await database.connect();

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const existingUser = await database.findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const user = await database.createUser(username, password);
    return NextResponse.json(
      { username: user.username, role: user.role },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to create user" },
      { status: 400 }
    );
  } finally {
    await database.close();
  }
}
