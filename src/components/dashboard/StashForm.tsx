'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { createStash } from '@/lib/actions';

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
      await createStash(text);
      setText('');
      router.refresh();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Drop your code here... Use #tags and @projects to organize"
          className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={!text.trim() || !hasTagsOrProjects || isSubmitting}
        className="w-full"
      >
        {getButtonText()}
      </Button>
    </form>
  );
} 