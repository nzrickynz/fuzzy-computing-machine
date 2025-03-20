import { getStashes } from '@/lib/actions';
import { StashForm } from '@/components/dashboard/StashForm';
import { StashList } from '@/components/dashboard/StashList';
import { FilterList } from '@/components/dashboard/FilterList';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function StashListWrapper({ stashes, isLoading }: { stashes: any[], isLoading: boolean }) {
  return (
    <div className="mt-8">
      <StashList stashes={stashes} isLoading={isLoading} />
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const tag = params.tag as string | undefined;
  const project = params.project as string | undefined;

  const stashes = await getStashes(tag, project);

  // Extract unique hashtags and projects
  const hashtags = Array.from(
    new Set(stashes.flatMap(stash => stash.hashtags.map(tag => tag.name)))
  );
  const projects = Array.from(
    new Set(stashes.flatMap(stash => stash.projects.map(project => project.name)))
  );

  // Convert dates to strings for the StashList component
  const formattedStashes = stashes.map(stash => ({
    ...stash,
    createdAt: stash.createdAt.toISOString(),
    usedAt: stash.usedAt?.toISOString() ?? null,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2">
          <StashForm />
          <Suspense fallback={<StashListWrapper stashes={[]} isLoading={true} />}>
            <StashListWrapper stashes={formattedStashes} isLoading={false} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <FilterList hashtags={hashtags} selectedTags={tag ? [tag] : []} />
            <ProjectList projects={projects} selectedProjects={project ? [project] : []} />
          </div>
        </div>
      </div>
    </div>
  );
} 