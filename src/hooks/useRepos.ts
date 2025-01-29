import { useState, useEffect } from 'react';
import { ReposData } from '@/types/repo';

const REPOS_URL = 'https://raw.githubusercontent.com/VermiNew/verminew.github.io/refs/heads/main/public/data/repos.json';

export const useRepos = () => {
  const [data, setData] = useState<ReposData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(REPOS_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch repos'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { data, isLoading, error };
}; 