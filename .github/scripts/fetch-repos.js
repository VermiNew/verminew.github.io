import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..', '..');

const DEFAULT_USERNAME = 'VermiNew';
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 2_000;
const MAX_RETRY_DELAY_MS = 60_000;

const REPOSITORY_FILTERS = Object.freeze({
  includeForks: false,
  includeArchived: false,
});

const FEATURED_REPOSITORIES = Object.freeze({
  'verminew.github.io': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'Portfolio website built with React, TypeScript and styled-components',
  },
  'w-chrystusie': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'Catholic web app with prayers, rosary and hymns',
  },
  'energy-monitoring-system': {
    category: 'frontend',
    priority: 1,
    featuredReason: 'Smart-home energy monitoring dashboard built with React and TypeScript',
  },
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const clampDelay = (milliseconds) => Math.min(
  Math.max(milliseconds, BASE_RETRY_DELAY_MS),
  MAX_RETRY_DELAY_MS,
);

export async function withRetry(operation, retries = MAX_RETRIES) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;

      const status = Number(error?.status ?? error?.response?.status ?? 0);
      const resetHeader = error?.response?.headers?.['x-ratelimit-reset'];
      const isRateLimited = status === 403 || status === 429;
      const retryAfterHeader = error?.response?.headers?.['retry-after'];

      let delay = BASE_RETRY_DELAY_MS * attempt;
      if (retryAfterHeader) {
        delay = Number.parseInt(retryAfterHeader, 10) * 1_000;
      } else if (isRateLimited && resetHeader) {
        delay = Number.parseInt(resetHeader, 10) * 1_000 - Date.now();
      }

      const safeDelay = clampDelay(Number.isFinite(delay) ? delay : BASE_RETRY_DELAY_MS);
      console.warn(`Attempt ${attempt}/${retries} failed (${status || 'network'}). Retrying in ${Math.ceil(safeDelay / 1_000)}s.`);
      await sleep(safeDelay);
    }
  }

  throw lastError;
}

export function validateDate(dateString) {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return new Date(0).toISOString();
  return parsed > new Date() ? new Date().toISOString() : parsed.toISOString();
}

export function normalizeWebUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return '';

  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

export function formatRepositoryTitle(name) {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export function shouldExcludeRepository(repository) {
  if (!REPOSITORY_FILTERS.includeForks && repository.fork) return true;
  if (!REPOSITORY_FILTERS.includeArchived && repository.archived) return true;
  return false;
}

const normalizeTechnologies = (languages = {}, topics = []) => {
  const technologies = new Map();
  const normalizedTopics = Array.isArray(topics) ? topics : [];

  for (const technology of [...Object.keys(languages ?? {}), ...normalizedTopics]) {
    if (typeof technology !== 'string') continue;
    const normalized = technology.trim();
    if (!normalized) continue;

    const key = normalized.toLocaleLowerCase('en-US');
    if (!technologies.has(key)) technologies.set(key, normalized);
  }

  return [...technologies.values()].sort((left, right) =>
    left.localeCompare(right, 'en-US', { sensitivity: 'base' }));
};

const getPrimaryLanguage = (languages = {}, repositoryLanguage) => {
  const primaryLanguage = Object.entries(languages ?? {})
    .filter(([, bytes]) => Number.isFinite(bytes))
    .sort((left, right) => right[1] - left[1])[0]?.[0];

  return primaryLanguage || repositoryLanguage || 'Unknown';
};

const getFallbackLanguages = (repository) =>
  typeof repository.language === 'string' && repository.language.trim()
    ? { [repository.language.trim()]: 1 }
    : {};

export function buildRepositoryRecord(repository, languages = {}) {
  const featuredConfiguration = FEATURED_REPOSITORIES[repository.name];
  const featured = Boolean(featuredConfiguration);
  const technologies = normalizeTechnologies(languages, repository.topics);

  const record = {
    id: repository.name,
    title: formatRepositoryTitle(repository.name),
    description: repository.description ?? '',
    technologies,
    language: getPrimaryLanguage(languages, repository.language),
    githubUrl: normalizeWebUrl(repository.html_url),
    liveUrl: normalizeWebUrl(repository.homepage),
    featured,
    archived: Boolean(repository.archived),
    visibility: 'public',
    createdAt: validateDate(repository.created_at),
    updatedAt: validateDate(repository.updated_at),
    priority: repository.archived ? 5 : (featuredConfiguration?.priority ?? 3),
    status: repository.archived ? 'archived' : 'active',
  };

  if (featuredConfiguration) {
    record.category = featuredConfiguration.category;
    record.featuredReason = featuredConfiguration.featuredReason;
  }

  return record;
}

const sortRepositoryRecords = (left, right) => {
  if (left.archived !== right.archived) return Number(left.archived) - Number(right.archived);
  if (left.featured !== right.featured) return Number(right.featured) - Number(left.featured);
  if (left.priority !== right.priority) return left.priority - right.priority;
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
};

const readExistingPayload = async (outputPath) => {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return null;
  }
};

const comparablePayload = (payload) => JSON.stringify({
  username: payload?.username,
  repos: payload?.repos,
});

export const resolveOutputPath = () => {
  const configuredPath = process.env.REPOS_OUTPUT_PATH;
  const outputPath = configuredPath
    ? path.resolve(projectRoot, configuredPath)
    : path.join(projectRoot, 'public', 'data', 'repos.json');

  const relativePath = path.relative(projectRoot, outputPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`REPOS_OUTPUT_PATH must remain inside the project: ${outputPath}`);
  }

  return outputPath;
};

export async function fetchRepositoryPayload({
  username = process.env.GITHUB_USERNAME || DEFAULT_USERNAME,
  token = process.env.GITHUB_TOKEN,
} = {}) {
  if (!token) console.warn('GITHUB_TOKEN is not set; using the lower unauthenticated API rate limit.');

  const { Octokit } = await import('@octokit/rest');
  const octokit = new Octokit({
    ...(token ? { auth: token } : {}),
    userAgent: 'VermiNew-Portfolio-Automation/1.0',
  });

  console.log(`Fetching public repositories for ${username}...`);
  const repositories = await withRetry(() => octokit.paginate(octokit.rest.repos.listForUser, {
    username,
    type: 'public',
    per_page: 100,
    sort: 'updated',
    direction: 'desc',
  }));

  const records = [];
  for (const repository of repositories) {
    if (shouldExcludeRepository(repository)) continue;

    let languages;
    try {
      ({ data: languages } = await withRetry(() => octokit.rest.repos.listLanguages({
        owner: username,
        repo: repository.name,
      })));
    } catch (error) {
      languages = getFallbackLanguages(repository);
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Language data unavailable for ${repository.name}; using repository metadata instead: ${message}`);
    }

    records.push(buildRepositoryRecord(repository, languages));
  }

  records.sort(sortRepositoryRecords);
  return {
    lastUpdated: new Date().toISOString(),
    username,
    repos: records,
  };
}

export async function writeRepositoryPayload(payload, {
  outputPath = resolveOutputPath(),
  force = process.env.FORCE_UPDATE === 'true',
} = {}) {
  const existingPayload = await readExistingPayload(outputPath);
  const changed = comparablePayload(existingPayload) !== comparablePayload(payload);

  if (!changed && !force) {
    console.log('Repository data has not changed. Keeping the existing file and timestamp.');
    return { changed: false, outputPath };
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, outputPath);

  console.log(`${changed ? 'Updated' : 'Refreshed'} ${path.relative(projectRoot, outputPath)} (${payload.repos.length} repositories).`);
  return { changed: true, outputPath };
}

async function main() {
  const payload = await fetchRepositoryPayload();
  await writeRepositoryPayload(payload);
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(`Repository update failed: ${error.message}`);
    process.exitCode = 1;
  });
}
