import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const { qrCode, eventId } = await req.json();

    const ticket = await Ticket.findOne({ qrCode }).populate({
      path: 'eventId',
      select: '_id',
    });
    if (!ticket) {
      return NextResponse.json({ message: 'Invalid QR code' }, { status: 404 });
    }

    if (ticket.eventId._id.toString() !== eventId.toString()) {
      return NextResponse.json({ message: 'QR code does not belong to this event' }, { status: 403 });
    }

    const event = await Event.findById(ticket.eventId);
    if (!event || !event.attendees.includes(userId)) {
      return NextResponse.json({ message: 'User is not registered for this event' }, { status: 403 });
    }

    if (ticket.used) {
      return NextResponse.json({ message: 'QR code has already been used' }, { status: 400 });
    }

    ticket.used = true;
    await ticket.save();

    return NextResponse.json({ message: 'QR code scanned successfully', ticket }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    console.error('Error scanning QR code:', error.message);
    return NextResponse.json({ message: 'Failed to scan QR code', error: error.message }, { status: 500 });
  }
}