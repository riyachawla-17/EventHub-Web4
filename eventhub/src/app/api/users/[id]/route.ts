import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const user = await User.findById(params.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, email } = body;

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
