import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  context: any
): Promise<ReturnType<typeof NextResponse.json>> {
  await dbConnect();
  const { id } = context.params;

  try {
    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    console.error("Error fetching event:", err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


export async function PUT(
  req: NextRequest,
  { params }: any
) {
  await dbConnect();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    const imageFile = formData.get("image") as File;

    let imagePath = body.image;
    if (imageFile && imageFile instanceof File) {
      const imageName = `${Date.now()}-${imageFile.name}`;
      imagePath = `/images/${imageName}`;
      const imageBuffer = await imageFile.arrayBuffer();
      const imageDir = path.join(process.cwd(), "public/images");

      fs.mkdirSync(imageDir, { recursive: true });
      fs.writeFileSync(
        path.join(imageDir, imageName),
        Buffer.from(imageBuffer)
      );
    }

    const validFields = {
      title: body.title,
      description: body.description,
      capacity: body.capacity,
      from: body.from,
      to: body.to,
      street: body.street,
      city: body.city,
      image: imagePath,
    };

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: params.id, createdBy: decoded.userId },
      validFields,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { message: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event updated", event: updatedEvent },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating event:", err);
    return NextResponse.json(
      { message: "Failed to update event", error: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  await dbConnect();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const event = await Event.findOneAndDelete({
      _id: params.id,
      createdBy: decoded.userId,
    });

    if (!event) {
      return NextResponse.json(
        { message: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Event deleted" });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}
