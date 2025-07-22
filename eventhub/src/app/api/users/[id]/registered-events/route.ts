import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: any
) {
  await dbConnect();
  const { id: userId } = context.params;

  try {
    const events = await Event.find({ attendees: userId });
    return NextResponse.json({ events }, { status: 200 });
  } catch (err) {
    console.error("Error fetching registered events:", err);
    return NextResponse.json(
      { message: "Failed to load events" },
      { status: 500 }
    );
  }
}
