'use client';

import Link from 'next/link';
import { useStashes } from '@/hooks/useStashes';

interface FilterListProps {
  selectedTag?: string;
}

export function FilterList({ selectedTag }: FilterListProps) {
  const { stashes } = useStashes();

  // Extract unique hashtags
  const hashtags = Array.from(
    new Set(stashes.flatMap(stash => stash.hashtags.map(tag => tag.name)))
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className={`px-3 py-1 rounded text-sm ${
            !selectedTag
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </Link>
        {hashtags.map((tag) => (
          <Link
            key={tag}
            href={`/dashboard?tag=${encodeURIComponent(tag)}`}
            className={`px-3 py-1 rounded text-sm ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
} 