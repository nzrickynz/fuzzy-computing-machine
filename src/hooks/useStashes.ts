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
  initialData?: Stash[];
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch stashes');
  }
  return response.json();
};

export function useStashes({ tag, project, initialData }: UseStashesOptions = {}) {
  // Build the URL with query parameters
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (project) params.set('project', project);
  const queryString = params.toString();
  const url = `/api/stashes${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<Stash[]>(
    url,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      keepPreviousData: true, // Keep showing previous data while fetching
    }
  );

  return {
    stashes: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
} 