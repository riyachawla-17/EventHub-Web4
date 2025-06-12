import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const body = await req.json();

    const newEvent = await Event.create({
      ...body,
      street: body.street,
      city: body.city,
      createdBy: decoded.userId
    });

    return NextResponse.json({ message: 'Event created', event: newEvent }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
}
