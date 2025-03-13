'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  projects: string[];
  selectedProjects: string[];
}

export function ProjectList({ projects, selectedProjects }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleProject = (project: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentProjects = params.getAll('projects');
    
    if (currentProjects.includes(project)) {
      // Remove project
      params.delete('projects');
      currentProjects.filter(p => p !== project).forEach(p => params.append('projects', p));
    } else {
      // Add project
      params.append('projects', project);
    }
    
    router.push(`?${params.toString()}`);
  };

  if (!projects.length) {
    return (
      <div className="card p-6">
        <h2 className="font-semibold text-gray-100 mb-2">Projects</h2>
        <p className="text-gray-400 text-sm">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-gray-100 mb-4">Projects</h2>
      <div className="space-y-2">
        {projects.map((project) => (
          <button
            key={project}
            onClick={() => toggleProject(project)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedProjects.includes(project)
                ? 'bg-green-900/50 text-green-300'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            @{project}
          </button>
        ))}
      </div>
    </div>
  );
} 