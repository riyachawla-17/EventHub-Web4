import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import Ticket from '@/models/Ticket';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  await dbConnect();

  const cookiesObj = await cookies();
  const token = cookiesObj.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const events = await Event.find({ attendees: userId })
      .populate('attendees', 'name')
      .lean();

    const tickets = await Ticket.find({ userId }).lean();

    const eventsWithTickets = await Promise.all(
      events.map(async (event) => {
        let ticket = tickets.find((t) => t.eventId.toString() === event._id.toString());

        if (!ticket) {
          ticket = await Ticket.create({
            userId,
            eventId: event._id,
            qrCode: `QR-${userId}-${event._id}`,
            used: false,
          });
        }

        return {
          ...event,
          qrCode: ticket.qrCode,
        };
      })
    );

    return NextResponse.json({ events: eventsWithTickets }, { status: 200 });
  } catch (err) {
    console.error('Error fetching registered events:', err);
    return NextResponse.json({ message: 'Failed to fetch registered events' }, { status: 500 });
  }
}