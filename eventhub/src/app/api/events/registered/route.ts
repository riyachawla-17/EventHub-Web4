import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const events = await Event.find({ attendees: userId })
      .populate('attendees', 'name')
      .lean();

    return NextResponse.json({ events }, { status: 200 });
  } catch (err) {
    console.error('Error fetching registered events:', err);
    return NextResponse.json({ message: 'Failed to fetch registered events' }, { status: 500 });
  }
}