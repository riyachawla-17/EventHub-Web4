import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const events = await Event.find({ attendees: params.id });
    return NextResponse.json({ events });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load events" },
      { status: 500 }
    );
  }
}
