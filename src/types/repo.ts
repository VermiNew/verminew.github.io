export interface RepoCategories {
  web: string[];
  ai: string[];
  desktop: string[];
}

export interface Repo {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  type: 'web' | 'ai' | 'desktop';
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  archived: boolean;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  stars: number;
  forks: number;
}

export interface ReposData {
  lastUpdated: string;
  categories: RepoCategories;
  repos: Repo[];
} 