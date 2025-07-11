import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ message: 'Authorized' }, { status: 200 });
  } catch (err) {
    console.error('Invalid token:', err);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}