'use client';

import { useStash } from '@/hooks/useStash';

interface UseButtonProps {
  stashId: string;
  isUsed: boolean;
}

export function UseButton({ stashId, isUsed }: UseButtonProps) {
  const { markAsUsed } = useStash({ stashId });

  return (
    <button
      onClick={markAsUsed}
      disabled={isUsed}
      className={`shrink-0 px-3 py-1.5 rounded text-sm transition-colors ${
        isUsed
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
          : 'bg-green-900/50 text-green-300 hover:bg-green-800/50 hover:text-green-200'
      }`}
    >
      {isUsed ? 'Used' : 'Use'}
    </button>
  );
} 