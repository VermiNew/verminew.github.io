import { access, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');

const generatedPaths = [
  'dist',
  'dist-ssr',
  'coverage',
  'test-results',
  'playwright-report',
  '.cache',
  '.temp',
  'node_modules/.tmp',
  'tsconfig.tsbuildinfo',
  'tsconfig.node.tsbuildinfo',
  'vite.config.js',
  'vite.config.d.ts',
];

const exists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

for (const relativePath of generatedPaths) {
  const targetPath = path.resolve(projectRoot, relativePath);

  if (!targetPath.startsWith(`${projectRoot}${path.sep}`)) {
    throw new Error(`Refusing to remove a path outside the project: ${targetPath}`);
  }

  if (await exists(targetPath)) {
    await rm(targetPath, { recursive: true, force: true });
    console.log(`Removed ${relativePath}`);
  }
}
