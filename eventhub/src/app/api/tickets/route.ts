import { NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const ticket = await Ticket.create(body);
    return NextResponse.json(ticket, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
