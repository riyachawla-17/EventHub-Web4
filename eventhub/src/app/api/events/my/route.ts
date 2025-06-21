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
    const events = await Event.find({ createdBy: decoded.userId }).lean();
    return NextResponse.json({ events }, { status: 200 });
  } catch (err) {
    console.error('Error fetching user events:', err);
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}