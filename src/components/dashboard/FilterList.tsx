'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterListProps {
  hashtags: string[];
  selectedTags: string[];
}

export function FilterList({ hashtags, selectedTags }: FilterListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const currentTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    const params = new URLSearchParams(searchParams.toString());
    if (currentTags.length > 0) {
      params.set('tags', currentTags.join(','));
    } else {
      params.delete('tags');
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  if (hashtags.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {hashtags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
} 