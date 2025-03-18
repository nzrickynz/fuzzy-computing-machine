'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';

export function StashForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hasTagsOrProjects = useMemo(() => {
    const hasHashtag = /#[\w-]+/.test(text);
    const hasProject = /@[\w-]+/.test(text);
    return hasHashtag || hasProject;
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !hasTagsOrProjects || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/stashes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create stash');
      }

      const data = await response.json();
      console.log('Stash created:', data);
      
      setText('');
      // Force a hard refresh to ensure the UI updates
      window.location.reload();
    } catch (error) {
      console.error('Error creating stash:', error);
      setError(error instanceof Error ? error.message : 'Failed to create stash');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Dropping...';
    if (!text.trim()) return 'Drop it!';
    if (!hasTagsOrProjects) return 'Add #tag or @project';
    return 'Drop it!';
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? Use #tags and @projects (Press Enter to submit)"
          className="input-field h-32 resize-none"
        />
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">
              {!hasTagsOrProjects && text.trim()
                ? 'Add at least one #tag or @project'
                : 'Press Enter to submit, Shift + Enter for new line'}
            </p>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!text.trim() || !hasTagsOrProjects || isSubmitting}
            className="px-6"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </form>
  );
} 