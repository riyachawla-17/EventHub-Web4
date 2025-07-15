import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  const userId = context.params.id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const userId = context.params.id;

  try {
    const body = await req.json();
    const { name, email } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const userId = context.params.id;

  try {
    const body = await req.json();
    const { name, email, role, registeredEvents } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, registeredEvents },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { message: "Error updating user (admin access)" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const userId = context.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
