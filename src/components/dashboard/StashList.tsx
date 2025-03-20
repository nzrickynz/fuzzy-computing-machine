'use client';

import { useState } from 'react';
import { Badge } from '@/components/shared/Badge';
import { markStashAsUsed } from '@/lib/actions';
import { useStashes } from '@/hooks/useStashes';
import { StashCard } from './StashCard';

interface StashListProps {
  selectedTag?: string;
  selectedProject?: string;
}

export function StashList({ selectedTag, selectedProject }: StashListProps) {
  const { stashes, isLoading, isError } = useStashes({
    tag: selectedTag,
    project: selectedProject,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load stashes. Please try again later.
      </div>
    );
  }

  if (stashes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No stashes found. Create your first stash!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stashes.map((stash) => (
        <StashCard key={stash.id} stash={stash} />
      ))}
    </div>
  );
} 