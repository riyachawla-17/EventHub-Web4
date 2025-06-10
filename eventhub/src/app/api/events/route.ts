import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}
