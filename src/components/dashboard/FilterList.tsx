'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  hashtags: string[];
  selectedTags: string[];
}

export function FilterList({ hashtags, selectedTags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.getAll('tags');
    
    if (currentTags.includes(tag)) {
      // Remove tag
      params.delete('tags');
      currentTags.filter(t => t !== tag).forEach(t => params.append('tags', t));
    } else {
      // Add tag
      params.append('tags', tag);
    }
    
    router.push(`?${params.toString()}`);
  };

  if (!hashtags.length) {
    return (
      <div className="card p-6">
        <h2 className="font-semibold text-gray-100 mb-2">Filters</h2>
        <p className="text-gray-400 text-sm">No hashtags yet</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-gray-100 mb-4">Filters</h2>
      <div className="space-y-2">
        {hashtags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-blue-900/50 text-blue-300'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
} 