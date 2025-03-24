'use client';

import { useState } from 'react';
import { Badge } from '@/components/shared/Badge';
import { markStashAsUsed } from '@/lib/actions';
import { useStashes } from '@/hooks/useStashes';
import { useSearchParams } from 'next/navigation';

interface Stash {
  id: string;
  text: string;
  createdAt: string;
  usedAt: string | null;
  hashtags: Array<{ name: string }>;
  projects: Array<{ name: string }>;
}

interface StashListProps {
  stashes: Stash[];
  isLoading?: boolean;
}

export function StashList({ stashes: initialStashes, isLoading: initialLoading = false }: StashListProps) {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') ?? undefined;
  const project = searchParams.get('project') ?? undefined;

  const [usedStashes, setUsedStashes] = useState<Set<string>>(
    new Set(initialStashes.filter(s => s.usedAt).map(s => s.id))
  );

  const { stashes, isLoading, isError } = useStashes({
    tag,
    project,
    initialData: initialStashes,
  });

  const handleUse = async (id: string) => {
    try {
      await markStashAsUsed(id);
      setUsedStashes(prev => new Set(Array.from(prev).concat(id)));
    } catch (error) {
      console.error('Error marking stash as used:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg p-4 space-y-3 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 py-8">
        Error loading stashes. Please try again later.
      </div>
    );
  }

  if (stashes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No stashes found. Create your first stash!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stashes.map((stash: Stash) => (
        <div
          key={stash.id}
          className="bg-gray-800 rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <p className="text-gray-200 whitespace-pre-wrap">{stash.text}</p>
            <button
              onClick={() => handleUse(stash.id)}
              disabled={usedStashes.has(stash.id)}
              className={`px-3 py-1 rounded text-sm ${
                usedStashes.has(stash.id)
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {usedStashes.has(stash.id) ? 'Used' : 'Use'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {stash.hashtags.map((tag: { name: string }) => (
              <Badge
                key={tag.name}
                label={tag.name}
                type="tag"
                isUsed={usedStashes.has(stash.id)}
              />
            ))}
            {stash.projects.map((project: { name: string }) => (
              <Badge
                key={project.name}
                label={project.name}
                type="project"
                isUsed={usedStashes.has(stash.id)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Created {formatDate(stash.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
} 