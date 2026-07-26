import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const notes = [];

const absolute = (relativePath) => path.join(root, relativePath);
const readText = (relativePath) => readFileSync(absolute(relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const fail = (message) => errors.push(message);
const pass = (message) => notes.push(message);

const walk = (directory, { skip = new Set() } = {}) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target, { skip }) : [target];
  });
};

const flatten = (value, prefix = '', output = new Map()) => {
  if (Array.isArray(value)) {
    output.set(prefix.replace(/_(zero|one|two|few|many|other)$/, '_plural'), `array:${value.length}`);
    return output;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, output);
    }
    return output;
  }
  output.set(prefix.replace(/_(zero|one|two|few|many|other)$/, '_plural'), typeof value);
  return output;
};

const assertFileContains = (file, requiredText, description) => {
  if (!readText(file).includes(requiredText)) fail(`${description} (${file})`);
  else pass(description);
};

const assertFileExcludes = (file, forbiddenText, description) => {
  if (readText(file).includes(forbiddenText)) fail(`${description} (${file})`);
  else pass(description);
};

try {
  const packageJson = readJson('package.json');
  const packageLock = readJson('package-lock.json');
  const lockRoot = packageLock.packages?.[''];
  const versions = [packageJson.version, packageLock.version, lockRoot?.version];
  if (new Set(versions).size !== 1 || versions.some((value) => typeof value !== 'string')) {
    fail(`Package versions differ: ${versions.join(', ')}`);
  } else {
    pass(`Package version is consistent: ${packageJson.version}`);
  }

  if (packageJson.packageManager !== 'npm@11.17.0') fail('packageManager must be npm@11.17.0');
  if (!String(packageJson.engines?.node ?? '').includes('26')) fail('package.json must require Node.js 26');
  if (!String(packageJson.engines?.npm ?? '').includes('11')) fail('package.json must require npm 11');
  if (packageJson.dependencies?.['i18next-browser-languagedetector']) fail('Unused browser language detector is still declared');
  if (lockRoot?.dependencies?.['i18next-browser-languagedetector']) fail('Unused browser language detector remains in package-lock.json');
  if (readText('.nvmrc').trim() !== '26') fail('.nvmrc must select Node.js 26');
  pass('Node.js and npm requirements checked');
} catch (error) {
  fail(`Package metadata is invalid: ${error.message}`);
}

try {
  const pl = flatten(readJson('src/locales/pl/translation.json'));
  const en = flatten(readJson('src/locales/en/translation.json'));
  const allKeys = new Set([...pl.keys(), ...en.keys()]);
  for (const key of allKeys) {
    if (!pl.has(key)) fail(`Missing Polish translation key: ${key}`);
    if (!en.has(key)) fail(`Missing English translation key: ${key}`);
    if (pl.has(key) && en.has(key) && pl.get(key) !== en.get(key)) {
      fail(`Translation value shape differs at ${key}: PL=${pl.get(key)}, EN=${en.get(key)}`);
    }
  }
  pass(`Translation structure checked (${allKeys.size} leaf keys)`);
} catch (error) {
  fail(`Translations are invalid: ${error.message}`);
}

try {
  const data = readJson('public/data/repos.json');
  if (!data.lastUpdated || Number.isNaN(Date.parse(data.lastUpdated))) fail('repos.json has an invalid lastUpdated date');
  if (data.username !== 'VermiNew') fail('repos.json must identify the GitHub username');
  if (!Array.isArray(data.repos)) fail('repos.json does not contain a repos array');

  const ids = new Set();
  for (const [index, repo] of (data.repos ?? []).entries()) {
    const required = [
      'id', 'title', 'description', 'technologies', 'language', 'githubUrl', 'featured',
      'archived', 'visibility', 'createdAt', 'updatedAt', 'priority', 'status',
    ];
    for (const field of required) {
      if (!(field in repo)) fail(`repos.json entry ${index} is missing ${field}`);
    }
    if (ids.has(repo.id)) fail(`repos.json contains duplicate id: ${repo.id}`);
    ids.add(repo.id);
    if (![1, 2, 3, 4, 5].includes(repo.priority)) fail(`Invalid priority for ${repo.id}`);
    if (repo.archived || repo.status === 'archived') fail(`Archived repository should not be published: ${repo.id}`);
    if ('stars' in repo || 'forks' in repo) fail(`Repository statistics should not be published: ${repo.id}`);
    if (!Array.isArray(repo.technologies) || !repo.technologies.every((technology) => typeof technology === 'string')) {
      fail(`Invalid technologies for ${repo.id}`);
    }
  }
  pass(`Repository data checked (${data.repos?.length ?? 0} entries)`);
} catch (error) {
  fail(`Repository data is invalid: ${error.message}`);
}

try {
  const manifest = readJson('public/manifest.json');
  const maskableIcons = [];
  for (const icon of manifest.icons ?? []) {
    const iconPath = absolute(path.join('public', icon.src.replace(/^\//, '')));
    if (!existsSync(iconPath)) fail(`Manifest icon does not exist: ${icon.src}`);
    if (String(icon.purpose ?? '').split(/\s+/).includes('maskable')) maskableIcons.push(icon.src);
  }
  if (maskableIcons.length < 2) fail('Manifest should include separate 192px and 512px maskable icons');
  pass(`Manifest assets checked (${manifest.icons?.length ?? 0} icons)`);
} catch (error) {
  fail(`Manifest is invalid: ${error.message}`);
}

try {
  const socialCard = readFileSync(absolute('public/assets/images/social-card.png'));
  if (socialCard.toString('ascii', 1, 4) !== 'PNG') throw new Error('invalid PNG signature');
  const width = socialCard.readUInt32BE(16);
  const height = socialCard.readUInt32BE(20);
  if (width !== 1200 || height !== 630) fail(`Social card must be 1200x630, found ${width}x${height}`);
  else pass('Social preview image dimensions checked');
} catch (error) {
  fail(`Social preview image is invalid: ${error.message}`);
}

const requiredFiles = [
  '.github/dependabot.yml',
  '.github/workflows/deploy.yml',
  '.github/workflows/quality.yml',
  '.github/workflows/release.yml',
  '.github/workflows/update-repos.yml',
  'lighthouserc.json',
  'public/404.html',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/sw.js',
  'RELEASE_CHECKLIST.md',
];
for (const file of requiredFiles) {
  if (!existsSync(absolute(file))) fail(`Required release file is missing: ${file}`);
}
if (requiredFiles.every((file) => existsSync(absolute(file)))) pass('Release and automation files checked');

const sourceChecks = [
  ['src/hooks/useRepos.ts', "const REPOS_URL = '/data/repos.json'", 'Project data must be loaded from the deployed site'],
  ['.github/scripts/fetch-repos.js', "path.dirname(fileURLToPath(import.meta.url))", 'Repository output must not depend on the workflow working directory'],
  ['.github/workflows/update-repos.yml', 'git add public/data/repos.json', 'Repository workflow must commit only the generated data file'],
  ['.github/workflows/update-repos.yml', "event_type='deploy_pages'", 'Repository automation must explicitly trigger deployment'],
  ['src/features/order/archive.ts', "await import('jszip')", 'JSZip must remain dynamically imported'],
  ['vite.config.ts', 'assets/[name]-[hash].js', 'Production JavaScript filenames must include a content hash'],
  ['src/styles/themes.ts', 'createThemeColors', 'Themes must use the semantic color contract'],
  ['src/utils/registerServiceWorker.ts', '/sw.js?v=', 'Service worker cache version must follow the application version'],
  ['public/sw.js', "url.pathname === '/data/repos.json'", 'Service worker must handle repository data separately from navigation'],
  ['.github/workflows/release.yml', 'verify-release-version.js', 'Release workflow must verify tag and package versions'],
];
for (const [file, requiredText, description] of sourceChecks) {
  assertFileContains(file, requiredText, description);
}

const forbiddenTextChecks = [
  ['.github/workflows/update-repos.yml', '[skip ci]', 'Automated repository commits must be allowed to trigger explicit deployment'],
  ['src/hooks/useRepos.ts', 'raw.githubusercontent.com', 'Runtime project data must not bypass the deployed release'],
  ['src/components/sections/OrderSection.tsx', 'files_for_order.zip', 'The order archive must use its unique order ID'],
  ['src/components/sections/OrderSection.tsx', "themeMode.includes('dark')", 'Theme darkness must use the shared helper'],
  ['.github/scripts/fetch-repos.js', 'stargazers_count', 'Repository selection must not depend on popularity statistics'],
  ['.github/scripts/fetch-repos.js', 'forks_count', 'Repository payload must not publish fork statistics'],
  ['public/sw.js', "caches.match('/index.html')\n      || new Response(\n      JSON.stringify", 'Repository JSON fallback must never return the HTML application shell'],
];
for (const [file, forbiddenText, description] of forbiddenTextChecks) {
  assertFileExcludes(file, forbiddenText, description);
}

const rejectedPlans = [
  /snake\s*game/i,
  /visit\s*counter/i,
  /licznik\s+odwiedzin/i,
  /github\s+statistics/i,
  /statystyk(?:a|i|ę|ą)?\s+githuba/i,
];
const planningFiles = ['README.md', 'TODO.md', 'project-requirements.md'];
for (const file of planningFiles) {
  const text = readText(file);
  for (const pattern of rejectedPlans) {
    if (pattern.test(text)) fail(`Rejected feature remains in ${file}: ${pattern}`);
  }
}
pass('Rejected feature plans are absent from project documentation');

const removedProductionModules = [
  'src/components/sections/BlogSection.tsx',
  'src/hooks/useGithubDiscussions.ts',
  'src/components/ui/ReloadPopup.tsx',
  'src/components/legal/TermsModal.tsx',
  'src/components/sections/GitHubStats',
];
for (const file of removedProductionModules) {
  if (existsSync(absolute(file))) fail(`Removed production module still exists: ${file}`);
}
if (removedProductionModules.every((file) => !existsSync(absolute(file)))) pass('Abandoned production modules are absent');

const forbiddenGeneratedPaths = [
  'dist',
  'coverage',
  'test-results',
  'playwright-report',
  'vite.config.js',
  'vite.config.d.ts',
];
for (const relativePath of forbiddenGeneratedPaths) {
  if (existsSync(absolute(relativePath))) fail(`Generated artifact should be removed: ${relativePath}`);
}
const generatedOutsideDependencies = walk(root, { skip: new Set(['.git', 'node_modules']) })
  .filter((file) => file.endsWith('.tsbuildinfo'));
for (const file of generatedOutsideDependencies) {
  fail(`TypeScript build cache must not be tracked outside node_modules: ${path.relative(root, file)}`);
}

const publicFiles = walk(absolute('public'));
const oversized = publicFiles.filter((file) => statSync(file).size > 500 * 1024);
for (const file of oversized) {
  fail(`Large public asset (${Math.ceil(statSync(file).size / 1024)} KB): ${path.relative(root, file)}`);
}
if (oversized.length === 0) pass(`Public assets checked (${publicFiles.length} files)`);

for (const note of notes) console.log(`✓ ${note}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`\nProject validation failed with ${errors.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log('\nProject validation passed.');
}
