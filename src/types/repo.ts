export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'tools' | 'ai';

export interface Repo {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  language: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  archived: boolean;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  stars: number;
  forks: number;
  category?: ProjectCategory;
  priority?: 1 | 2 | 3;
  featuredReason?: string;
}

export interface ReposData {
  lastUpdated: string;
  repos: Repo[];
} 