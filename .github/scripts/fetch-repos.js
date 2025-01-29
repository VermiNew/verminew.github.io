import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        featured: topics.includes('featured'),
        archived: repo.archived,
        visibility: 'public',
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        stars: repo.stargazers_count,
        forks: repo.forks_count
      };
    }));

    // Dodaj metadane
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