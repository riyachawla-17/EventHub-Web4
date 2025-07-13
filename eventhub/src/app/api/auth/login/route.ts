import dbConnect  from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  const response = NextResponse.json({ message: 'Login successful', token });
  response.cookies.set('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}
