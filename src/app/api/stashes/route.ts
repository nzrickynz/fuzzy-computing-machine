import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const project = searchParams.get('project');

    const stashes = await prisma.stash.findMany({
      where: {
        userId: user.id,
        AND: [
          tag ? {
            hashtags: {
              some: {
                name: tag,
              },
            },
          } : {},
          project ? {
            projects: {
              some: {
                name: project,
              },
            },
          } : {},
        ],
      },
      include: {
        hashtags: true,
        projects: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stashes);
  } catch (error) {
    console.error('Error fetching stashes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stashes' },
      { status: 500 }
    );
  }
} 