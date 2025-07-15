import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const events = await Event.find({ createdBy: decoded.userId })
      .populate("attendees", "name")
      .lean();

    if (!events || events.length === 0) {
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (err) {
    console.error("Error fetching user events:", err);
    return NextResponse.json(
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
