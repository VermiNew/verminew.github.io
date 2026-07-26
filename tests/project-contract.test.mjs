import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const json = (file) => JSON.parse(read(file));

const flattenKeys = (value, prefix = '', result = []) => {
  if (Array.isArray(value) || value === null || typeof value !== 'object') {
    result.push(prefix.replace(/_(zero|one|two|few|many|other)$/, '_plural'));
    return result;
  }
  for (const [key, child] of Object.entries(value)) {
    flattenKeys(child, prefix ? `${prefix}.${key}` : key, result);
  }
  return result;
};

test('Polish and English translations expose the same keys', () => {
  const pl = [...new Set(flattenKeys(json('src/locales/pl/translation.json')))].sort();
  const en = [...new Set(flattenKeys(json('src/locales/en/translation.json')))].sort();
  assert.deepEqual(pl, en);
});

test('manifest references existing icons and separate maskable artwork', () => {
  const manifest = json('public/manifest.json');
  const maskable = manifest.icons.filter((icon) => icon.purpose === 'maskable');
  assert.ok(maskable.length >= 2);
  for (const icon of manifest.icons) {
    assert.ok(existsSync(new URL(`../public${icon.src}`, import.meta.url)), icon.src);
  }
});

test('repository data has unique identifiers and supported priorities', () => {
  const data = json('public/data/repos.json');
  assert.ok(!Number.isNaN(Date.parse(data.lastUpdated)));
  const ids = data.repos.map((repo) => repo.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const repo of data.repos) {
    assert.ok(repo.priority === undefined || [1, 2, 3, 4, 5].includes(repo.priority));
  }
});

test('repository update commits are allowed to trigger deployment', () => {
  const workflow = read('.github/workflows/update-repos.yml');
  assert.equal(workflow.includes('[skip ci]'), false);
  assert.ok(workflow.includes('public/data/repos.json'));
});

test('order archive is versioned and loaded only when requested', () => {
  const source = read('src/features/order/archive.ts');
  assert.ok(source.includes("await import('jszip')"));
  assert.ok(source.includes('createOrderPayload'));
  assert.ok(read('src/features/order/payload.ts').includes('schemaVersion: 1'));
});

test('all theme declarations use the semantic color builder', () => {
  const source = read('src/styles/themes.ts');
  const declarations = [...source.matchAll(/export const \w+Theme: Theme = \{/g)];
  const builders = [...source.matchAll(/colors: createThemeColors\(\{/g)];
  assert.equal(declarations.length, 16);
  assert.equal(builders.length, declarations.length);
});
