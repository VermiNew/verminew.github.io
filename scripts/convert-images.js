import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = {
    original: null, // Keep original size
    md: 800,       // Medium size - 800px width
    sm: 400        // Small size - 400px width
};

const PWA_SIZES = [16, 32, 64, 192, 512];
const FORMATS = ['webp', 'avif'];
const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/assets/images';
const FAVICON_OUTPUT_DIR = 'public/assets/favicons';

async function ensureDirectoryExists(directory) {
    try {
        await fs.access(directory);
    } catch {
        await fs.mkdir(directory, { recursive: true });
    }
}

async function generatePWAIcons(logoPath) {
    try {
        await ensureDirectoryExists(FAVICON_OUTPUT_DIR);
        const image = sharp(logoPath);

        // Generate favicon.ico (multi-size ICO file)
        const faviconSizes = [16, 32, 64];
        const icoBuffers = await Promise.all(
            faviconSizes.map(size => 
                image
                    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .toFormat('png')
                    .toBuffer()
            )
        );

        // Use sharp to create individual PNG files for PWA
        for (const size of PWA_SIZES) {
            const outputPath = path.join(FAVICON_OUTPUT_DIR, `logo${size}.png`);
            await image
                .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .png()
                .toFile(outputPath);
            console.log(`Generated PWA icon: ${outputPath}`);
        }
    } catch (error) {
        console.error('Error generating PWA icons:', error);
    }
}

async function convertImage(inputPath, fileName) {
    const fileNameWithoutExt = path.parse(fileName).name;
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // If this is the logo, generate PWA icons
    if (fileNameWithoutExt.toLowerCase() === 'logo') {
        await generatePWAIcons(inputPath);
    }

    // Process each size
    for (const [sizeName, targetWidth] of Object.entries(SIZES)) {
        const resizedImage = targetWidth
            ? image.resize(targetWidth, null, { withoutEnlargement: true })
            : image;

        // For original size, save in original format
        if (sizeName === 'original') {
            const outputPath = path.join(OUTPUT_DIR, fileName);
            await resizedImage.toFile(outputPath);
            console.log(`Saved original: ${outputPath}`);
        }

        // Convert to each format
        for (const format of FORMATS) {
            const outputFileName = sizeName === 'original'
                ? `${fileNameWithoutExt}.${format}`
                : `${fileNameWithoutExt}-${sizeName}.${format}`;
            const outputPath = path.join(OUTPUT_DIR, outputFileName);

            await resizedImage[format]({
                quality: 80,
                effort: 6, // For AVIF/WebP compression
            }).toFile(outputPath);

            console.log(`Converted: ${outputPath}`);
        }
    }
}

async function processImages() {
    try {
        // Ensure output directories exist
        await ensureDirectoryExists(OUTPUT_DIR);
        await ensureDirectoryExists(FAVICON_OUTPUT_DIR);

        // Get all files from input directory
        const files = await fs.readdir(INPUT_DIR);
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );

        console.log(`Found ${imageFiles.length} images to process in ${INPUT_DIR}`);
        console.log(`Converting and saving to ${OUTPUT_DIR}`);

        // Process each image
        for (const file of imageFiles) {
            const inputPath = path.join(INPUT_DIR, file);
            console.log(`Processing: ${file}`);
            await convertImage(inputPath, file);
        }

        console.log('Image conversion completed successfully!');
    } catch (error) {
        console.error('Error processing images:', error);
        if (error.code === 'ENOENT') {
            console.error(`Directory not found: ${error.path}`);
            console.error('Please make sure the source directory exists and contains images.');
        }
    }
}

processImages(); 