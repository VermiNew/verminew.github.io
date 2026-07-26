import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const RESPONSIVE_SIZES = { original: null, md: 800, sm: 400 };
const PWA_SIZES = [16, 32, 64, 180, 192, 512];
const MASKABLE_SIZES = [192, 512];
const FORMATS = ['webp', 'avif'];
const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/assets/images';
const FAVICON_OUTPUT_DIR = 'public/assets/favicons';
const SOCIAL_CARD_PATH = path.join(OUTPUT_DIR, 'social-card.png');

const ensureDirectory = (directory) => fs.mkdir(directory, { recursive: true });

async function generatePwaIcons(logoPath) {
  await ensureDirectory(FAVICON_OUTPUT_DIR);

  for (const size of PWA_SIZES) {
    const outputPath = path.join(FAVICON_OUTPUT_DIR, `logo${size}.png`);
    await sharp(logoPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    console.log(`Generated PWA icon: ${outputPath}`);
  }

  for (const size of MASKABLE_SIZES) {
    const inset = Math.round(size * 0.18);
    const logo = await sharp(logoPath)
      .resize(size - inset * 2, size - inset * 2, { fit: 'contain' })
      .png()
      .toBuffer();
    const outputPath = path.join(FAVICON_OUTPUT_DIR, `logo${size}-maskable.png`);
    await sharp({
      create: { width: size, height: size, channels: 4, background: '#0a1929' },
    })
      .composite([{ input: logo, left: inset, top: inset }])
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    console.log(`Generated maskable icon: ${outputPath}`);
  }
}

async function generateSocialCard(logoPath) {
  const logo = await sharp(logoPath).resize(250, 250, { fit: 'contain' }).png().toBuffer();
  const textLayer = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#071526"/>
          <stop offset="1" stop-color="#173b67"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="170" cy="315" r="150" fill="#ffffff" fill-opacity="0.06"/>
      <text x="365" y="270" fill="#ffffff" font-family="Arial, sans-serif" font-size="82" font-weight="700">VermiNew</text>
      <text x="370" y="345" fill="#93c5fd" font-family="Arial, sans-serif" font-size="38">Developer Portfolio</text>
      <text x="370" y="415" fill="#dbeafe" font-family="Arial, sans-serif" font-size="28">React · TypeScript · Web Development</text>
    </svg>
  `);
  await sharp(textLayer)
    .composite([{ input: logo, left: 45, top: 190 }])
    .png({ compressionLevel: 9 })
    .toFile(SOCIAL_CARD_PATH);
  console.log(`Generated social card: ${SOCIAL_CARD_PATH}`);
}

async function writeConvertedImage(inputPath, outputPath, width, format) {
  const image = sharp(inputPath);
  if (width) image.resize(width, null, { withoutEnlargement: true });
  await image[format]({ quality: 80, effort: 6 }).toFile(outputPath);
  console.log(`Converted: ${outputPath}`);
}

async function convertImage(inputPath, fileName) {
  const parsedName = path.parse(fileName);
  const isLogo = parsedName.name.toLowerCase() === 'logo';

  if (isLogo) {
    await generatePwaIcons(inputPath);
    await generateSocialCard(inputPath);
  }

  for (const [sizeName, targetWidth] of Object.entries(RESPONSIVE_SIZES)) {
    for (const format of FORMATS) {
      const outputFileName = sizeName === 'original'
        ? `${parsedName.name}.${format}`
        : `${parsedName.name}-${sizeName}.${format}`;
      await writeConvertedImage(inputPath, path.join(OUTPUT_DIR, outputFileName), targetWidth, format);
    }
  }
}

async function processImages() {
  await ensureDirectory(OUTPUT_DIR);
  await ensureDirectory(FAVICON_OUTPUT_DIR);
  const files = await fs.readdir(INPUT_DIR);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));
  if (imageFiles.length === 0) throw new Error(`No source images found in ${INPUT_DIR}`);

  for (const file of imageFiles) {
    await convertImage(path.join(INPUT_DIR, file), file);
  }
  console.log('Image conversion completed successfully.');
}

processImages().catch((error) => {
  console.error('Image conversion failed:', error);
  process.exitCode = 1;
});
