import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguracja ze zmiennych środowiskowych
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'VermiNew';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 sekundy

// Filtry repozytoriów
const REPO_FILTERS = {
  includeForks: false, // Ukryj forki
  includeArchived: true, // Pokaż archived ale z niższym priorytetem
  minStars: 0, // Minimalny próg gwiazdek (0 = wszystkie)
};

// Featured repos
const FEATURED_REPOS = {
  'verminew.github.io': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'Portfolio website built with React, TypeScript and styled-components'
  },
  'w-chrystusie': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'Catholic web app — prayers, rosary and hymns in one place'
  },
  'energy-monitoring-system': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'Smart home energy monitoring dashboard built with React and TypeScript'
  }
};

// Helper: Sleep function dla retry
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Retry mechanism
async function withRetry(fn, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      const isRateLimit = error.status === 403 || error.status === 429;
      
      if (isLastAttempt) {
        throw error;
      }
      
      if (isRateLimit) {
        const resetTime = error.response?.headers?.['x-ratelimit-reset'];
        const waitTime = resetTime 
          ? (parseInt(resetTime) * 1000 - Date.now()) 
          : RETRY_DELAY * (i + 1);
        
        console.log(`⏳ Rate limit hit. Waiting ${Math.ceil(waitTime / 1000)}s before retry ${i + 1}/${retries}...`);
        await sleep(Math.max(waitTime, RETRY_DELAY));
      } else {
        console.log(`⚠️  Attempt ${i + 1}/${retries} failed. Retrying in ${RETRY_DELAY / 1000}s...`);
        await sleep(RETRY_DELAY * (i + 1));
      }
    }
  }
}

// Helper: Walidacja daty
function validateDate(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  return date > now ? now.toISOString() : dateStr;
}

// Helper: Format repo title
function formatRepoTitle(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper: Sprawdź czy repo powinno być featured (automatyczna detekcja)
function shouldAutoFeature(repo) {
  return (
    repo.stargazers_count >= 2 || // Ma przynajmniej 2 gwiazdki
    (repo.homepage && repo.homepage.length > 0) || // Ma live URL
    repo.name in FEATURED_REPOS // Ręcznie wybrany
  );
}

// Helper: Sprawdź czy repo powinno być filtrowane
function shouldFilterRepo(repo) {
  // Filtruj forki jeśli ustawione
  if (!REPO_FILTERS.includeForks && repo.fork) {
    return true;
  }
  
  // Filtruj archived jeśli ustawione
  if (!REPO_FILTERS.includeArchived && repo.archived) {
    return true;
  }
  
  // Filtruj repo poniżej minimalnej liczby gwiazdek
  if (repo.stargazers_count < REPO_FILTERS.minStars) {
    return true;
  }
  
  return false;
}

async function fetchRepos() {
  if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN is not set!');
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
    userAgent: 'VermiNew-Portfolio/1.0'
  });

  try {
    console.log(`📡 Fetching repositories for ${GITHUB_USERNAME}...`);

    // Pobierz rate limit info
    const { data: rateLimit } = await octokit.rateLimit.get();
    console.log(`📊 Rate limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit} remaining`);

    // Pobierz wszystkie repozytoria z retry
    const { data: repos } = await withRetry(async () => {
      return await octokit.repos.listForUser({
        username: GITHUB_USERNAME,
        type: 'public',
        per_page: 100,
        sort: 'updated',
        direction: 'desc'
      });
    });

    console.log(`✅ Found ${repos.length} repositories`);

    // Statystyki
    let stats = {
      totalPublic: repos.length,
      filtered: 0,
      featured: 0,
      archived: 0,
      withLiveDemo: 0,
      withStars: 0,
      languages: {},
    };

    // Przetwórz repozytoria z rate limiting i retry
    const reposWithDetails = [];
    let processed = 0;

    for (const repo of repos) {
      // Filtruj repo według kryteriów
      if (shouldFilterRepo(repo)) {
        stats.filtered++;
        console.log(`⏭️  Skipping ${repo.name} (filtered)`);
        continue;
      }

      try {
        // Pobierz języki z retry
        const { data: languages } = await withRetry(async () => {
          return await octokit.repos.listLanguages({
            owner: GITHUB_USERNAME,
            repo: repo.name
          });
        });

        const topics = repo.topics || [];
        const allTechnologies = [
          ...Object.keys(languages),
          ...topics
        ].filter((value, index, self) => self.indexOf(value) === index);

        // Sprawdź featured (ręcznie lub automatycznie)
        const featuredInfo = FEATURED_REPOS[repo.name] || {};
        const isManuallyFeatured = repo.name in FEATURED_REPOS;
        const isAutoFeatured = shouldAutoFeature(repo);
        const isFeatured = isManuallyFeatured || isAutoFeatured;

        // Priorytet: archived dostaje najniższy
        let priority = 3;
        if (isFeatured) {
          priority = featuredInfo.priority || 2;
        }
        if (repo.archived) {
          priority = 5; // Archived na końcu
        }

        const repoData = {
          id: repo.name,
          title: formatRepoTitle(repo.name),
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
          priority: priority,
          ...(isFeatured && featuredInfo.category && {
            category: featuredInfo.category,
            featuredReason: featuredInfo.featuredReason || 'Interesting project worth highlighting'
          })
        };

        reposWithDetails.push(repoData);

        // Aktualizuj statystyki
        if (isFeatured) stats.featured++;
        if (repo.archived) stats.archived++;
        if (repo.homepage) stats.withLiveDemo++;
        if (repo.stargazers_count > 0) stats.withStars++;
        
        // Zlicz języki
        Object.keys(languages).forEach(lang => {
          stats.languages[lang] = (stats.languages[lang] || 0) + 1;
        });

        processed++;
        console.log(`📦 Processed ${processed}/${repos.length - stats.filtered}: ${repo.name}${isFeatured ? ' ⭐' : ''}${repo.archived ? ' 📦' : ''}`);

        // Dodaj małe opóźnienie między requestami (GitHub API best practice)
        if (processed < repos.length - stats.filtered) {
          await sleep(100);
        }
      } catch (error) {
        console.error(`❌ Failed to process ${repo.name}:`, error.message);
        // Kontynuuj mimo błędu pojedynczego repo
        continue;
      }
    }

    // Sortuj: Featured -> Priority -> Updated
    reposWithDetails.sort((a, b) => {
      if (a.featured !== b.featured) return b.featured - a.featured;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    // Przygotuj dane z metadatami i statystykami
    const data = {
      lastUpdated: new Date().toISOString(),
      username: GITHUB_USERNAME,
      stats: {
        total: reposWithDetails.length,
        filtered: stats.filtered,
        featured: stats.featured,
        archived: stats.archived,
        withLiveDemo: stats.withLiveDemo,
        withStars: stats.withStars,
        languages: stats.languages,
      },
      repos: reposWithDetails
    };

    // Upewnij się, że katalog istnieje
    const outputDir = path.join(process.cwd(), 'public', 'data');
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Zapisz dane
    const outputPath = path.join(outputDir, 'repos.json');
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(data, null, 2)
    );

    console.log('\n✅ Repository data updated successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`\n📊 Statistics:`);
    console.log(`   Total repos: ${data.stats.total}`);
    console.log(`   Featured: ${data.stats.featured}`);
    console.log(`   Archived: ${data.stats.archived}`);
    console.log(`   With live demo: ${data.stats.withLiveDemo}`);
    console.log(`   With stars: ${data.stats.withStars}`);
    console.log(`   Filtered out: ${data.stats.filtered}`);
    console.log(`\n🔤 Languages:`);
    Object.entries(data.stats.languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([lang, count]) => {
        console.log(`   ${lang}: ${count}`);
      });

    // Sprawdź finalny rate limit
    const { data: finalRateLimit } = await octokit.rateLimit.get();
    console.log(`\n📊 Final rate limit: ${finalRateLimit.rate.remaining}/${finalRateLimit.rate.limit} remaining`);

  } catch (error) {
    console.error('\n❌ Error fetching repository data:', error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    if (error.response?.headers?.['x-ratelimit-remaining']) {
      console.error(`   Rate limit remaining: ${error.response.headers['x-ratelimit-remaining']}`);
    }
    process.exit(1);
  }
}

fetchRepos();