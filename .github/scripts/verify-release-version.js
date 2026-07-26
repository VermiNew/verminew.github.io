import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..', '..');

export const normalizeReleaseTag = (tag) => String(tag ?? '').trim().replace(/^refs\/tags\//, '').replace(/^v/, '');

export const verifyReleaseVersion = async ({
  tag = process.env.RELEASE_TAG || process.env.GITHUB_REF_NAME,
  packagePath = path.join(projectRoot, 'package.json'),
  lockfilePath = path.join(projectRoot, 'package-lock.json'),
} = {}) => {
  const normalizedTag = normalizeReleaseTag(tag);
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(normalizedTag)) {
    throw new Error(`Release tag must use vMAJOR.MINOR.PATCH format: ${tag || '<empty>'}`);
  }

  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  const packageLock = JSON.parse(await readFile(lockfilePath, 'utf8'));
  const versions = new Set([packageJson.version, packageLock.version, packageLock.packages?.['']?.version]);

  if (versions.size !== 1 || !versions.has(normalizedTag)) {
    throw new Error(
      `Release ${normalizedTag} does not match package metadata: ${[...versions].join(', ')}`,
    );
  }

  return normalizedTag;
};

async function main() {
  const version = await verifyReleaseVersion();
  console.log(`Release metadata verified: v${version}`);
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(`Release verification failed: ${error.message}`);
    process.exitCode = 1;
  });
}
