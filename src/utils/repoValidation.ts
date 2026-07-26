import type {
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
  Repo,
  ReposData,
} from '@/types/repo';

const categories = new Set<ProjectCategory>(['frontend', 'backend', 'fullstack', 'tools', 'ai']);
const statuses = new Set<ProjectStatus>(['active', 'planned', 'archived']);
const priorities = new Set<ProjectPriority>([1, 2, 3, 4, 5]);

const isString = (value: unknown): value is string => typeof value === 'string';
const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isString(value);
const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;
const isWebUrl = (value: unknown): value is string => {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
const isOptionalWebUrl = (value: unknown): value is string | undefined =>
  value === undefined || value === '' || isWebUrl(value);
const isIsoDate = (value: unknown): value is string =>
  isString(value) && !Number.isNaN(Date.parse(value));

export const isValidRepo = (value: unknown): value is Repo => {
  if (typeof value !== 'object' || value === null) return false;

  const repo = value as Record<string, unknown>;
  return (
    isNonEmptyString(repo.id) &&
    isNonEmptyString(repo.title) &&
    isString(repo.description) &&
    Array.isArray(repo.technologies) &&
    repo.technologies.every(isNonEmptyString) &&
    isNonEmptyString(repo.language) &&
    isWebUrl(repo.githubUrl) &&
    isOptionalWebUrl(repo.liveUrl) &&
    typeof repo.featured === 'boolean' &&
    typeof repo.archived === 'boolean' &&
    isString(repo.visibility) &&
    isIsoDate(repo.createdAt) &&
    isIsoDate(repo.updatedAt) &&
    (repo.category === undefined || categories.has(repo.category as ProjectCategory)) &&
    (repo.priority === undefined || priorities.has(repo.priority as ProjectPriority)) &&
    isOptionalString(repo.featuredReason) &&
    (repo.status === undefined || statuses.has(repo.status as ProjectStatus))
  );
};

export const isValidReposData = (value: unknown): value is ReposData => {
  if (typeof value !== 'object' || value === null) return false;

  const data = value as Record<string, unknown>;
  return (
    isIsoDate(data.lastUpdated) &&
    Array.isArray(data.repos) &&
    data.repos.every(isValidRepo)
  );
};
