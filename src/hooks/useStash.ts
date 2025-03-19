import { useRouter } from 'next/navigation';

interface UseStashProps {
  stashId: string;
  onSuccess?: () => void;
}

export function useStash({ stashId, onSuccess }: UseStashProps) {
  const router = useRouter();

  const markAsUsed = async () => {
    try {
      const response = await fetch(`/api/stashes/${stashId}/use`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark stash as used');
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Error marking stash as used:', error);
      throw error;
    }
  };

  return {
    markAsUsed,
  };
} 