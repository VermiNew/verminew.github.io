const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

// Predefiniowane tagi dla kategorii
const categoryTags = {
  web: [
    'web', 'website', 'frontend', 'backend', 'fullstack',
    'react', 'vue', 'angular', 'javascript', 'typescript',
    'html', 'css', 'sass', 'less', 'nodejs', 'express',
    'nextjs', 'gatsby', 'webpack', 'vite', 'bootstrap',
    'tailwind', 'responsive', 'pwa'
  ],
  ai: [
    'ai', 'machine-learning', 'deep-learning', 'neural-network',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn',
    'computer-vision', 'nlp', 'data-science', 'jupyter',
    'pandas', 'numpy', 'matplotlib', 'opencv', 'reinforcement-learning',
    'artificial-intelligence'
  ],
  desktop: [
    'desktop', 'desktop-app', 'electron', 'qt', 'gtk',
    'windows', 'linux', 'macos', 'cross-platform',
    'gui', 'cli', 'terminal', 'system', 'utility'
  ]
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

      // Określ typ projektu na podstawie tagów
      let type = 'web'; // domyślnie
      const topics = repo.topics || [];
      
      for (const [category, tags] of Object.entries(categoryTags)) {
        if (topics.some(topic => tags.includes(topic))) {
          type = category;
          break;
        }
      }

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
        image: '/src/assets/images/projects/placeholder.jpg',
        technologies: allTechnologies,
        type,
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
      categories: categoryTags,
      repos: reposWithDetails
    };

    // Upewnij się, że katalog istnieje
    await fs.mkdir(path.join(process.cwd(), 'public', 'data'), { recursive: true });

    // Zapisz dane do pliku
    await fs.writeFile(
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