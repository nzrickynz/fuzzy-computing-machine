import { z } from 'zod';

export const StashSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  hashtags: z.array(z.string()),
  projects: z.array(z.string()),
});

export type StashInput = z.infer<typeof StashSchema>;

export interface Stash {
  id: string;
  content: string;
  used: boolean;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  hashtags: Array<{ id: string; name: string }>;
  projects: Array<{ id: string; name: string }>;
}

export interface Filter {
  id: string;
  name: string;
  type: 'hashtag' | 'project';
  selected: boolean;
} 