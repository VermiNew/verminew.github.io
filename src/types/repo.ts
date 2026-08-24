export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'tools' | 'ai';
export type ProjectStatus = 'active' | 'planned' | 'archived';
export type ProjectVisibility = 'public' | 'private' | 'internal' | string;
export type ProjectPriority = 1 | 2 | 3 | 4 | 5;

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
  visibility: ProjectVisibility;
  createdAt: string;
  updatedAt: string;
  stars?: number;
  forks?: number;
  category?: ProjectCategory;
  priority?: ProjectPriority;
  featuredReason?: string;
  status?: ProjectStatus;
}

export interface ReposData {
  lastUpdated: string;
  repos: Repo[];
}
