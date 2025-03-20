'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStashes } from '@/hooks/useStashes';

interface ProjectListProps {
  selectedProject?: string;
}

export function ProjectList({ selectedProject }: ProjectListProps) {
  const { stashes } = useStashes();

  // Extract unique projects
  const projects = Array.from(
    new Set(stashes.flatMap(stash => stash.projects.map(project => project.name)))
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard"
          className={`px-3 py-1 rounded text-sm ${
            !selectedProject
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </Link>
        {projects.map((project) => (
          <Link
            key={project}
            href={`/dashboard?project=${encodeURIComponent(project)}`}
            className={`px-3 py-1 rounded text-sm ${
              selectedProject === project
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {project}
          </Link>
        ))}
      </div>
    </div>
  );
} 