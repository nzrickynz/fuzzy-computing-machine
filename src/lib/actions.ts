'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

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

export async function getStashes(tag?: string, project?: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const prisma = new PrismaClient();
  
  try {
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
    
    return stashes;
  } catch (error) {
    console.error('Error fetching stashes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createStash(text: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input');
  }

  const prisma = new PrismaClient();

  try {
    // Extract hashtags and projects from text
    const hashtags = Array.from(text.matchAll(/#[\w-]+/g)).map(match => match[0].slice(1));
    const projects = Array.from(text.matchAll(/@[\w-]+/g)).map(match => match[0].slice(1));

    // First, ensure the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
        }
      });
    }

    // Then create the stash
    return await prisma.stash.create({
      data: {
        text,
        userId: user.id,
        hashtags: {
          connectOrCreate: hashtags.map(name => ({
            where: { name } as Prisma.HashtagWhereUniqueInput,
            create: { name }
          }))
        },
        projects: {
          connectOrCreate: projects.map(name => ({
            where: { name } as Prisma.ProjectWhereUniqueInput,
            create: { name }
          }))
        }
      },
      include: {
        hashtags: true,
        projects: true
      }
    });
  } catch (error) {
    console.error('Error creating stash:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function markStashAsUsed(id: string) {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const prisma = new PrismaClient();

  try {
    // Find the stash and verify ownership
    const stash = await prisma.stash.findUnique({
      where: { id },
    });

    if (!stash) {
      throw new Error('Stash not found');
    }

    if (stash.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    // Update the stash with usedAt timestamp
    return await prisma.stash.update({
      where: { id },
      data: {
        usedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error marking stash as used:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
} 