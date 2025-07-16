import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import Ticket from '@/models/Ticket';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  await dbConnect();
  const cookiesObj = await cookies();
  const token = cookiesObj.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const { eventId } = await req.json();

    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    if (event.attendees.includes(userId)) {
      return NextResponse.json({ message: 'User already booked this event' }, { status: 400 });
    }

    if (event.capacity >= 0 && event.attendees.length >= event.capacity) {
      return NextResponse.json({ message: 'Event is fully booked' }, { status: 400 });
    }

    event.attendees.push(userId);
    await event.save();

    const ticket = await Ticket.create({
      userId,
      eventId,
      qrCode: `QR-${userId}-${eventId}`,
      used: false,
    });

    return NextResponse.json(
      { message: 'Ticket booked successfully', event, ticket },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error booking ticket:', err);
    return NextResponse.json({ message: 'Failed to book ticket', error: err.message }, { status: 500 });
  }
}