import { useCallback, useEffect, useState } from 'react';
import type { ReposData } from '@/types/repo';
import { isValidReposData } from '@/utils/repoValidation';
import { safeStorage } from '@/utils/storage';

const REPOS_URL = '/data/repos.json';
const CACHE_KEY = 'verminew:repos-cache:v1';
const FETCH_TIMEOUT = 8_000;

interface CachedRepos {
  data: ReposData;
  timestamp: number;
}

const readCache = (): CachedRepos | null => {
  const raw = safeStorage.get(CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const candidate = parsed as Record<string, unknown>;
    if (typeof candidate.timestamp !== 'number' || !isValidReposData(candidate.data)) {
      safeStorage.remove(CACHE_KEY);
      return null;
    }

    return { data: candidate.data, timestamp: candidate.timestamp };
  } catch {
    safeStorage.remove(CACHE_KEY);
    return null;
  }
};

const writeCache = (data: ReposData): void => {
  safeStorage.set(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now(),
  } satisfies CachedRepos));
};

export const useRepos = () => {
  const [initialCache] = useState(readCache);
  const [data, setData] = useState<ReposData | null>(initialCache?.data ?? null);
  const [isLoading, setIsLoading] = useState(initialCache === null);
  const [error, setError] = useState<Error | null>(null);
  const [warning, setWarning] = useState<'cached' | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    let active = true;

    const fetchRepos = async (): Promise<void> => {
      try {
        const response = await fetch(REPOS_URL, {
          signal: controller.signal,
          cache: 'no-cache',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error(`Repository data request failed (${response.status})`);

        const payload: unknown = await response.json();
        if (!isValidReposData(payload)) throw new Error('Repository data has an invalid format');
        if (!active) return;

        setData(payload);
        writeCache(payload);
        setError(null);
        setWarning(null);
      } catch (reason) {
        if (!active) return;

        const cached = readCache();
        if (cached) {
          setData(cached.data);
          setError(null);
          setWarning('cached');
        } else {
          setError(reason instanceof Error ? reason : new Error('Repository data could not be loaded'));
          setWarning(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchRepos();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [refreshToken]);

  const retry = useCallback(() => {
    setError(null);
    setWarning(null);
    setIsLoading(data === null);
    setRefreshToken((value) => value + 1);
  }, [data]);

  return { data, isLoading, error, warning, retry };
};
