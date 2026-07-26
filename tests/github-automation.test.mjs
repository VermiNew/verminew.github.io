import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildRepositoryRecord,
  formatRepositoryTitle,
  normalizeWebUrl,
  shouldExcludeRepository,
  validateDate,
  writeRepositoryPayload,
} from '../.github/scripts/fetch-repos.js';

const repository = {
  name: 'sample-project',
  description: null,
  html_url: 'https://github.com/VermiNew/sample-project',
  homepage: '',
  fork: false,
  archived: false,
  topics: ['react', 'typescript'],
  language: 'TypeScript',
  created_at: '2024-01-02T03:04:05Z',
  updated_at: '2025-02-03T04:05:06Z',
};

test('repository automation excludes forks and archived repositories without popularity filters', () => {
  assert.equal(shouldExcludeRepository(repository), false);
  assert.equal(shouldExcludeRepository({ ...repository, fork: true }), true);
  assert.equal(shouldExcludeRepository({ ...repository, archived: true }), true);
  assert.equal(shouldExcludeRepository({ ...repository, stargazers_count: 0 }), false);
});

test('repository records use stable public metadata and unique technologies', () => {
  const record = buildRepositoryRecord(repository, { TypeScript: 100, CSS: 50 });
  assert.equal(record.id, 'sample-project');
  assert.equal(record.title, 'Sample Project');
  assert.equal(record.status, 'active');
  assert.equal(record.archived, false);
  assert.deepEqual(record.technologies, ['CSS', 'react', 'TypeScript']);
  assert.equal(record.language, 'TypeScript');
  assert.equal('stars' in record, false);
  assert.equal('forks' in record, false);
});

test('repository records choose the largest language and keep a repository metadata fallback', () => {
  const record = buildRepositoryRecord(repository, { CSS: 50, TypeScript: 100 });
  const fallback = buildRepositoryRecord({ ...repository, language: 'JavaScript', topics: [] }, {});

  assert.equal(record.language, 'TypeScript');
  assert.equal(fallback.language, 'JavaScript');
});

test('repository links accept only HTTP and HTTPS addresses', () => {
  assert.equal(normalizeWebUrl('https://example.com/demo'), 'https://example.com/demo');
  assert.equal(normalizeWebUrl('javascript:alert(1)'), '');
  assert.equal(normalizeWebUrl('not-a-url'), '');
});

test('repository formatting and dates are deterministic and safe', () => {
  assert.equal(formatRepositoryTitle('energy-monitoring-system'), 'Energy Monitoring System');
  assert.equal(validateDate('invalid-date'), new Date(0).toISOString());
  assert.equal(validateDate('2020-01-01T00:00:00Z'), '2020-01-01T00:00:00.000Z');
});

test('repository payload writes atomically and preserves timestamp when content is unchanged', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'verminew-repos-'));
  const outputPath = path.join(directory, 'repos.json');
  const payload = {
    lastUpdated: '2026-07-23T10:00:00.000Z',
    username: 'VermiNew',
    repos: [buildRepositoryRecord(repository, { TypeScript: 100 })],
  };

  try {
    const first = await writeRepositoryPayload(payload, { outputPath });
    assert.equal(first.changed, true);

    const second = await writeRepositoryPayload({
      ...payload,
      lastUpdated: '2026-07-23T11:00:00.000Z',
    }, { outputPath });
    assert.equal(second.changed, false);

    const stored = JSON.parse(await readFile(outputPath, 'utf8'));
    assert.equal(stored.lastUpdated, payload.lastUpdated);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
