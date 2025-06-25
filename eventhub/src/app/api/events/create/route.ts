import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  await dbConnect();
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json({ message: 'Invalid Content-Type' }, { status: 400 });
    }

    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    const imageFile = formData.get('image') as File;

    let imagePath = '';
    if (imageFile) {
      const imageName = `${Date.now()}-${imageFile.name}`;
      imagePath = `/images/${imageName}`;
      const imageBuffer = await imageFile.arrayBuffer();
      const imageDir = path.join(process.cwd(), 'public/images');
      fs.writeFileSync(path.join(imageDir, imageName), Buffer.from(imageBuffer));
    }

    const newEvent = await Event.create({
      ...body,
      image: imagePath,
      createdBy: decoded.userId,
    });

    return NextResponse.json({ message: 'Event created', event: newEvent }, { status: 201 });
  } catch (err) {
    console.error('Error creating event:', err);
    return NextResponse.json({ message: 'Failed to create event', err }, { status: 400 });
  }
}