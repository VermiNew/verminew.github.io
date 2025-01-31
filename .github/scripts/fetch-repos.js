import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FEATURED_REPOS = {
  'verminew.github.io': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'My portfolio website showcasing my projects and skills in modern web development'
  },
  'BackupTool': {
    category: 'tools',
    priority: 2,
    featuredReason: 'Efficient backup solution with user-friendly GUI and robust file management'
  },
  'AudioAnalyzers': {
    category: 'fullstack',
    priority: 2,
    featuredReason: 'Advanced audio processing tool demonstrating expertise in web audio technologies'
  },
  'PortableBlenderManager': {
    category: 'tools',
    priority: 2,
    featuredReason: 'Innovative tool for managing Blender configurations and workspace'
  }
};

async function fetchRepos() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  try {
    // Pobierz wszystkie repozytoria
    const { data: repos } = await octokit.repos.listForUser({
      username: 'VermiNew',
      type: 'public',
      per_page: 100
    });

    const reposWithDetails = await Promise.all(repos.map(async (repo) => {
      // Pobierz języki dla repozytorium
      const { data: languages } = await octokit.repos.listLanguages({
        owner: 'VermiNew',
        repo: repo.name
      });

      const topics = repo.topics || [];

      // Połącz wszystkie technologie (języki i tagi)
      const allTechnologies = [
        ...Object.keys(languages),
        ...topics
      ].filter((value, index, self) => self.indexOf(value) === index);

      // Walidacja dat - upewnij się, że nie są z przyszłości
      const now = new Date();
      const validateDate = (dateStr) => {
        const date = new Date(dateStr);
        return date > now ? now.toISOString() : dateStr;
      };

      // Sprawdź, czy repo jest wyróżnione i pobierz dodatkowe informacje
      const featuredInfo = FEATURED_REPOS[repo.name] || {};
      const isFeatured = repo.name in FEATURED_REPOS;

      return {
        id: repo.name,
        title: repo.name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        description: repo.description || '',
        technologies: allTechnologies,
        language: Object.keys(languages)[0] || 'Unknown',
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || '',
        featured: isFeatured,
        archived: repo.archived,
        visibility: 'public',
        createdAt: validateDate(repo.created_at),
        updatedAt: validateDate(repo.updated_at),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        priority: isFeatured ? featuredInfo.priority : 3,
        ...(isFeatured && {
          category: featuredInfo.category,
          featuredReason: featuredInfo.featuredReason
        })
      };
    }));

    // Dodaj metadane z walidacją daty
    const data = {
      lastUpdated: new Date().toISOString(),
      repos: reposWithDetails
    };

    // Upewnij się, że katalog istnieje
    await fs.promises.mkdir(path.join(process.cwd(), 'public', 'data'), { recursive: true });

    // Zapisz dane do pliku
    await fs.promises.writeFile(
      path.join(process.cwd(), 'public', 'data', 'repos.json'),
      JSON.stringify(data, null, 2)
    );

    console.log('Repository data updated successfully!');
  } catch (error) {
    console.error('Error fetching repository data:', error);
    process.exit(1);
  }
}

fetchRepos(); 