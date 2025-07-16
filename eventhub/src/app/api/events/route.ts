import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await dbConnect();

  const cookiesObj = await cookies();
  const token = cookiesObj.get('token')?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
