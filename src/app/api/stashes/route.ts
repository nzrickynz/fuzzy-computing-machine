import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';

async function getUser() {
  const cookieStore = cookies();
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

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get('tag');
    const project = searchParams.get('project');

    const where: Prisma.StashWhereInput = {
      userId: user.id,
      ...(tag && {
        hashtags: {
          some: { name: tag }
        }
      }),
      ...(project && {
        projects: {
          some: { name: project }
        }
      })
    };

    const stashes = await prisma.stash.findMany({
      where,
      include: {
        hashtags: true,
        projects: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(stashes);
  } catch (error) {
    console.error('Error fetching stashes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Extract hashtags and projects from text
    const hashtags = Array.from(text.matchAll(/#[\w-]+/g)).map(match => match[0].slice(1));
    const projects = Array.from(text.matchAll(/@[\w-]+/g)).map(match => match[0].slice(1));

    console.log('Creating stash with:', { text, hashtags, projects, userId: user.id });

    // Create stash with hashtags and projects
    const stash = await prisma.stash.create({
      data: {
        text,
        user: {
          connect: {
            id: user.id
          }
        },
        hashtags: {
          connectOrCreate: hashtags.map(name => ({
            where: {
              name
            } as Prisma.HashtagWhereUniqueInput,
            create: {
              name
            }
          }))
        },
        projects: {
          connectOrCreate: projects.map(name => ({
            where: {
              name
            } as Prisma.ProjectWhereUniqueInput,
            create: {
              name
            }
          }))
        }
      },
      include: {
        hashtags: true,
        projects: true
      }
    });

    console.log('Stash created successfully:', stash);
    return NextResponse.json(stash);
  } catch (error) {
    console.error('Detailed error creating stash:', error);
    // Check if it's a Prisma error with a code
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string; message: string };
      return NextResponse.json(
        { error: `Database error: ${prismaError.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 