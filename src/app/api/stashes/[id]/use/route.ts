import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find the stash and verify ownership
    const stash = await prisma.stash.findUnique({
      where: { id: params.id },
    });

    if (!stash) {
      return NextResponse.json(
        { error: 'Stash not found' },
        { status: 404 }
      );
    }

    if (stash.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update the stash with usedAt timestamp
    const updatedStash = await prisma.stash.update({
      where: { id: params.id },
      data: {
        usedAt: new Date(),
      },
    });

    return NextResponse.json(updatedStash);
  } catch (error) {
    console.error('Error marking stash as used:', error);
    return NextResponse.json(
      { error: 'Failed to mark stash as used' },
      { status: 500 }
    );
  }
} 