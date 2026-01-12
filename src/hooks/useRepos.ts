import { useState, useEffect } from 'react';
import { ReposData } from '@/types/repo';

const REPOS_URL = 'https://raw.githubusercontent.com/VermiNew/verminew.github.io/refs/heads/main/public/data/repos.json';
const CACHE_KEY = 'repos_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

const getCachedRepos = (): { data: ReposData; timestamp: number } | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
    
    return isExpired ? null : parsed;
  } catch {
    return null;
  }
};

const setCachedRepos = (data: ReposData): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Silent fail if localStorage is unavailable
  }
};

export const useRepos = () => {
  const [data, setData] = useState<ReposData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReposWithRetry = async () => {
      // Try cache first
      const cached = getCachedRepos();
      if (cached) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

          const response = await fetch(REPOS_URL, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonData = await response.json();
          setData(jsonData);
          setCachedRepos(jsonData);
          setError(null);
          setIsLoading(false);
          return;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Failed to fetch repos');
          
          // Exponential backoff: 1s, 2s, 4s
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
          }
        }
      }

      // All retries failed, use cache as fallback or show error
      const cachedFallback = localStorage.getItem(CACHE_KEY);
      if (cachedFallback) {
        try {
          const parsed = JSON.parse(cachedFallback);
          setData(parsed.data);
          setError(new Error('Using cached data - network unavailable'));
        } catch {
          setError(lastError || new Error('Failed to fetch repos after retries'));
        }
      } else {
        setError(lastError || new Error('Failed to fetch repos'));
      }

      setIsLoading(false);
    };

    fetchReposWithRetry();
  }, []);

  return { data, isLoading, error };
}; 