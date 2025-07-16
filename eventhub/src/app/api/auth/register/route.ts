import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  const lastUser = await User.findOne().sort({ userId: -1 });
  const nextUserId = lastUser?.userId ? lastUser.userId + 1 : 1;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    userId: nextUserId,
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const { password: _, ...userData } = newUser.toObject();
  return NextResponse.json(
    { message: 'Registered successfully', user: userData, token },
    { status: 201 }
  );
}
