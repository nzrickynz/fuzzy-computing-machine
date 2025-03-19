import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { StashForm } from '@/components/dashboard/StashForm';
import { StashList } from '@/components/dashboard/StashList';
import { FilterList } from '@/components/dashboard/FilterList';
import { ProjectList } from '@/components/dashboard/ProjectList';

export const dynamic = 'force-dynamic';

async function getStashes(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log('No user found or error:', error);
      return null;
    }

    const stashes = await prisma.stash.findMany({
      where: {
        userId: user.id,
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
    return null;
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

  const hashtags = Array.from(new Set(stashes.flatMap(s => s.hashtags.map(h => h.name)))).sort();
  const projects = Array.from(new Set(stashes.flatMap(s => s.projects.map(p => p.name)))).sort();

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