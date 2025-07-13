import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const event = await Event.findById(id).lean();
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (err) {
    console.error("Error in GET /api/events/[id]:", err);
    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const resolvedParams = await params;
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    const imageFile = formData.get("image") as File;

    console.log("Received form data:", body); // Debug log
    console.log("Image file:", imageFile); // Debug log

    let imagePath = body.image;
    if (imageFile && imageFile instanceof File) {
      const imageName = `${Date.now()}-${imageFile.name}`;
      imagePath = `/images/${imageName}`;
      const imageBuffer = await imageFile.arrayBuffer();
      const imageDir = path.join(process.cwd(), "public/images");
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

    console.log("Valid fields for update:", validFields); // Debug log

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: resolvedParams.id, createdBy: decoded.userId },
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
    console.error("Error updating event:", err); // Debug log
    return NextResponse.json(
      { message: "Failed to update event", error: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
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
