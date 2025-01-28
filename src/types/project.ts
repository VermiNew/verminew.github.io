export type ProjectType = 'all' | 'web' | 'ai' | 'desktop';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  type: ProjectType;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
  archived?: boolean;
  visibility: string;
} 