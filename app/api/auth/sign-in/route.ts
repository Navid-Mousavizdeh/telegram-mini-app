import { database } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await database.connect();
  try {
    const { username, password } = await request.json();
    const token = await database.login(username, password);
    if (!token) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  } finally {
    await database.close();
  }
}
