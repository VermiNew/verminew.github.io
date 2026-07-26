import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ORDER_OPTION_IDS, getOptionLabel } from '../src/features/order/options.ts';
import { isValidRepo, isValidReposData } from '../src/utils/repoValidation.ts';

const readJson = (path: string): unknown => JSON.parse(
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'),
);

test('order option identifiers match both localized label lists', () => {
  const pl = readJson('src/locales/pl/translation.json') as Record<string, unknown>;
  const en = readJson('src/locales/en/translation.json') as Record<string, unknown>;
  const keyByField = {
    clientType: 'clientTypeOptions',
    contactMethod: 'contactMethodOptions',
    source: 'sourceOptions',
    type: 'typeOptions',
    existingProject: 'existingProjectOptions',
    budget: 'budgetOptions',
    deadline: 'deadlineOptions',
    contentReady: 'contentReadyOptions',
    hasDomain: 'hasDomainOptions',
  } as const;

  for (const field of Object.keys(ORDER_OPTION_IDS) as Array<keyof typeof ORDER_OPTION_IDS>) {
    const key = keyByField[field];
    const ids = ORDER_OPTION_IDS[field];
    const plLabels = pl.order.form[key] as string[];
    const enLabels = en.order.form[key] as string[];
    assert.equal(plLabels.length, ids.length, `PL ${field}`);
    assert.equal(enLabels.length, ids.length, `EN ${field}`);
    assert.equal(getOptionLabel(field, ids[0] ?? '', enLabels), enLabels[0]);
  }
});

test('repository runtime validator accepts the shipped data and rejects malformed records', () => {
  const data = readJson('public/data/repos.json');
  assert.equal(isValidReposData(data), true);
  assert.equal(isValidRepo({ id: 'broken' }), false);

  const validData = data as { repos: Array<Record<string, unknown>> };
  const unsafeLink = { ...validData.repos[0], liveUrl: 'javascript:alert(1)' };
  assert.equal(isValidRepo(unsafeLink), false);
});
