import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the stash ID from the URL
    const id = request.url.split('/').slice(-2)[0];

    // Find the stash and verify ownership
    const stash = await prisma.stash.findUnique({
      where: { id },
    });

    if (!stash) {
      return NextResponse.json(
        { error: 'Stash not found' },
        { status: 404 }
      );
    }

    if (stash.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update the stash with usedAt timestamp
    const updatedStash = await prisma.stash.update({
      where: { id },
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