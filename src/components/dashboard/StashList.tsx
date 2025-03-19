'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { UseButton } from './UseButton';
import { Badge } from '@/components/shared/Badge';

interface StashWithRelations {
  id: string;
  text: string;
  createdAt: Date;
  usedAt: Date | null;
  userId: string;
  hashtags: { name: string }[];
  projects: { name: string }[];
}

interface StashListProps {
  stashes: StashWithRelations[];
}

export function StashList({ stashes }: StashListProps) {
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
            <UseButton stashId={stash.id} isUsed={!!stash.usedAt} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {stash.hashtags.map((tag) => (
              <Badge
                key={tag.name}
                label={tag.name}
                type="tag"
                isUsed={!!stash.usedAt}
              />
            ))}
            {stash.projects.map((project) => (
              <Badge
                key={project.name}
                label={project.name}
                type="project"
                isUsed={!!stash.usedAt}
              />
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