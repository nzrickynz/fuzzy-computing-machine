import { useState } from 'react';
import { Badge } from '@/components/shared/Badge';
import { markStashAsUsed } from '@/lib/actions';

interface Stash {
  id: string;
  text: string;
  createdAt: string;
  usedAt: string | null;
  hashtags: Array<{ name: string }>;
  projects: Array<{ name: string }>;
}

interface StashCardProps {
  stash: Stash;
}

export function StashCard({ stash }: StashCardProps) {
  const [isUsed, setIsUsed] = useState(!!stash.usedAt);

  const handleUse = async () => {
    try {
      await markStashAsUsed(stash.id);
      setIsUsed(true);
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

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <p className="text-gray-200 whitespace-pre-wrap">{stash.text}</p>
        <button
          onClick={handleUse}
          disabled={isUsed}
          className={`px-3 py-1 rounded text-sm ${
            isUsed
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isUsed ? 'Used' : 'Use'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {stash.hashtags.map((tag) => (
          <Badge
            key={tag.name}
            label={tag.name}
            type="tag"
            isUsed={isUsed}
          />
        ))}
        {stash.projects.map((project) => (
          <Badge
            key={project.name}
            label={project.name}
            type="project"
            isUsed={isUsed}
          />
        ))}
      </div>
      <p className="text-sm text-gray-400">
        Created {formatDate(stash.createdAt)}
      </p>
    </div>
  );
} 