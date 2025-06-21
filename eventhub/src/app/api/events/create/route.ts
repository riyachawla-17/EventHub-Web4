import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const body = await req.json();

    console.log('Creating new event with data:', {
      ...body,
      street: body.street,
      city: body.city,
      createdBy: decoded.userId,
    });

    const newEvent = await Event.create({
      ...body,
      street: body.street,
      city: body.city,
      createdBy: decoded.userId,
    });

    console.log('New Event:', newEvent);

    return NextResponse.json({ message: 'Event created', event: newEvent }, { status: 201 });
  } catch (err) {
    console.error('Error creating event:', err);
    return NextResponse.json({ message: 'Failed to create event', err }, { status: 400 });
  }
}