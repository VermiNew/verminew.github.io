import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  normalizeReleaseTag,
  verifyReleaseVersion,
} from '../.github/scripts/verify-release-version.js';

test('release tags normalize refs and v prefixes', () => {
  assert.equal(normalizeReleaseTag('refs/tags/v1.2.3'), '1.2.3');
  assert.equal(normalizeReleaseTag('v1.2.3-rc.1'), '1.2.3-rc.1');
});

test('release metadata must match package and lockfile versions', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'verminew-release-'));
  const packagePath = path.join(directory, 'package.json');
  const lockfilePath = path.join(directory, 'package-lock.json');

  try {
    await writeFile(packagePath, JSON.stringify({ version: '1.2.3' }));
    await writeFile(lockfilePath, JSON.stringify({ version: '1.2.3', packages: { '': { version: '1.2.3' } } }));
    assert.equal(await verifyReleaseVersion({ tag: 'v1.2.3', packagePath, lockfilePath }), '1.2.3');
    await assert.rejects(
      verifyReleaseVersion({ tag: 'v1.2.4', packagePath, lockfilePath }),
      /does not match package metadata/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
