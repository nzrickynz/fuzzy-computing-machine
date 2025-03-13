'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface StashWithRelations {
  id: string;
  text: string;
  createdAt: Date;
  usedAt: Date | null;
  userId: string;
  hashtags: { name: string }[];
  projects: { name: string }[];
}

interface Props {
  stashes: StashWithRelations[];
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function StashList({ stashes }: Props) {
  const router = useRouter();

  const handleUse = async (stashId: string) => {
    try {
      const response = await fetch(`/api/stashes/${stashId}/use`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark stash as used');
      router.refresh();
    } catch (error) {
      console.error('Error marking stash as used:', error);
    }
  };

  if (!stashes.length) {
    return (
      <div className="card p-8 text-center text-gray-400">
        No stashes yet. Drop your first one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stashes.map((stash) => (
        <div 
          key={stash.id} 
          className={`card p-6 transition-colors ${
            stash.usedAt ? 'bg-gray-800/50' : ''
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <p className={`text-gray-100 whitespace-pre-wrap ${
              stash.usedAt ? 'text-gray-400' : ''
            }`}>
              {stash.text}
            </p>
            <button
              onClick={() => handleUse(stash.id)}
              disabled={!!stash.usedAt}
              className={`shrink-0 px-3 py-1.5 rounded text-sm transition-colors ${
                stash.usedAt
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-green-900/50 text-green-300 hover:bg-green-800/50 hover:text-green-200'
              }`}
            >
              {stash.usedAt ? 'Used' : 'Use'}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {stash.hashtags.map((tag) => (
              <span
                key={tag.name}
                className={`px-2 py-1 text-sm rounded-lg ${
                  stash.usedAt
                    ? 'bg-gray-700/50 text-gray-400'
                    : 'bg-blue-900/50 text-blue-300'
                }`}
              >
                #{tag.name}
              </span>
            ))}
            {stash.projects.map((project) => (
              <span
                key={project.name}
                className={`px-2 py-1 text-sm rounded-lg ${
                  stash.usedAt
                    ? 'bg-gray-700/50 text-gray-400'
                    : 'bg-green-900/50 text-green-300'
                }`}
              >
                @{project.name}
              </span>
            ))}
          </div>
          <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span>Created {formatDate(stash.createdAt)}</span>
            {stash.usedAt && (
              <span>Used {formatDate(stash.usedAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 