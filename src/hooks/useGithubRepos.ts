import { useState, useEffect } from 'react';
import { Project, ProjectType } from '../types/project';

interface ReposData {
  lastUpdated: string;
  categories: {
    [key in ProjectType]: string[];
  };
  repos: Project[];
}

export const useGithubRepos = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<{ [key in ProjectType]: string[] }>({
    web: [],
    ai: [],
    desktop: [],
    all: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/data/repos.json');
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const data: ReposData = await response.json();
        
        setProjects(data.repos);
        setCategories(data.categories);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { projects, categories, isLoading, error };
}; 