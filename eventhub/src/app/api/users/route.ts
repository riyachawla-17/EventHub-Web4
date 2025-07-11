import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET /api/users
export async function GET() {
  await dbConnect();

  try {
    const users = await User.find().select("-password");
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
