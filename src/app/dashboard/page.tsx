import { FilterList } from '@/components/dashboard/FilterList';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { StashList } from '@/components/dashboard/StashList';

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const tag = typeof params.tag === 'string' ? params.tag : undefined;
  const project = typeof params.project === 'string' ? params.project : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <div className="space-y-8">
          <FilterList selectedTag={tag} />
          <ProjectList selectedProject={project} />
        </div>
        <div>
          <StashList selectedTag={tag} selectedProject={project} />
        </div>
      </div>
    </div>
  );
} 