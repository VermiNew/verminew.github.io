import { useState, useEffect } from 'react';

export interface Post {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  date: string;
  readingTime: number;
  tags: string[];
}

export const useGithubDiscussions = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        // GitHub GraphQL API wymaga tokena, więc na razie zwracamy przykładowe dane
        // TODO: Dodać prawdziwą integrację z GitHub Discussions API
        const mockPosts: Post[] = [
          {
            id: '1',
            title: 'Rozpoczynam naukę AI/ML',
            url: '#',
            excerpt: 'W tym wpisie opisuję moje pierwsze kroki w świecie sztucznej inteligencji i uczenia maszynowego...',
            date: '2024-01-27',
            readingTime: 5,
            tags: ['AI', 'ML', 'Python']
          },
          {
            id: '2',
            title: 'React i TypeScript - moje doświadczenia',
            url: '#',
            excerpt: 'Dzielę się moimi doświadczeniami z nauki React i TypeScript. Jakie problemy napotkałem i jak je rozwiązałem...',
            date: '2024-01-25',
            readingTime: 7,
            tags: ['React', 'TypeScript', 'Web']
          }
        ];

        setPosts(mockPosts);
        setTags([...new Set(mockPosts.flatMap(post => post.tags))]);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch discussions');
        setIsLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  return { posts, tags, isLoading, error };
}; 