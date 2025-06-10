import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id).lean();
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (err) {
    console.error('Error in GET /api/events/[id]:', err);
    return NextResponse.json({ message: 'Failed to fetch event' }, { status: 500 });
  }
}