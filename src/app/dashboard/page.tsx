import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { StashForm } from '@/components/dashboard/StashForm';
import { StashList } from '@/components/dashboard/StashList';
import { FilterList } from '@/components/dashboard/FilterList';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface Hashtag {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface Stash {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  usedAt: Date | null;
  hashtags: Hashtag[];
  projects: Project[];
}

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
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getStashes(searchParams: { [key: string]: string | string[] | undefined }) {
  const user = await getUser();
  if (!user) return null;

  const tags = searchParams.tags ? (Array.isArray(searchParams.tags) ? searchParams.tags : [searchParams.tags]) : [];
  const projects = searchParams.projects ? (Array.isArray(searchParams.projects) ? searchParams.projects : [searchParams.projects]) : [];

  try {
    const where: Prisma.StashWhereInput = {
      userId: user.id,
      ...(tags.length > 0 && {
        hashtags: {
          some: {
            name: {
              in: tags,
            },
          },
        },
      }),
      ...(projects.length > 0 && {
        projects: {
          some: {
            name: {
              in: projects,
            },
          },
        },
      }),
    };

    const stashes = await prisma.stash.findMany({
      where,
      include: {
        hashtags: true,
        projects: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return stashes as Stash[];
  } catch (error) {
    console.error('Error fetching stashes:', error);
    throw error;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const stashes = await getStashes(searchParams);
  if (!stashes) {
    redirect('/login');
  }

  const hashtags = Array.from(
    new Set(stashes.flatMap((s: Stash) => s.hashtags.map((h: Hashtag) => h.name)))
  ).sort();
  
  const projects = Array.from(
    new Set(stashes.flatMap((s: Stash) => s.projects.map((p: Project) => p.name)))
  ).sort();

  const selectedTags = searchParams.tags ? 
    (Array.isArray(searchParams.tags) ? searchParams.tags : [searchParams.tags]) : 
    [];
    
  const selectedProjects = searchParams.projects ? 
    (Array.isArray(searchParams.projects) ? searchParams.projects : [searchParams.projects]) : 
    [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <FilterList hashtags={hashtags} selectedTags={selectedTags} />
        <ProjectList projects={projects} selectedProjects={selectedProjects} />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <StashForm />
        <StashList stashes={stashes} />
      </div>
    </div>
  );
} 