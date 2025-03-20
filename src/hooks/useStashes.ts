import useSWR from 'swr';

interface Stash {
  id: string;
  text: string;
  createdAt: string;
  usedAt: string | null;
  hashtags: Array<{ name: string }>;
  projects: Array<{ name: string }>;
}

interface UseStashesOptions {
  tag?: string;
  project?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch stashes');
  }
  return response.json();
};

export function useStashes({ tag, project }: UseStashesOptions = {}) {
  const params = new URLSearchParams();
  if (tag) params.append('tag', tag);
  if (project) params.append('project', project);

  const { data, error, isLoading, mutate } = useSWR<Stash[]>(
    `/api/stashes?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate when window regains focus
      revalidateOnReconnect: false, // Don't revalidate when browser regains network
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    stashes: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
} 