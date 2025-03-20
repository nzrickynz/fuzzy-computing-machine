import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const project = searchParams.get('project');

  try {
    const stashes = await prisma.stash.findMany({
      where: {
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