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

const FORMATS = ['webp', 'avif'];
const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/assets/images';

async function ensureDirectoryExists(directory) {
    try {
        await fs.access(directory);
    } catch {
        await fs.mkdir(directory, { recursive: true });
    }
}

async function convertImage(inputPath, fileName) {
    const fileNameWithoutExt = path.parse(fileName).name;
    const image = sharp(inputPath);
    const metadata = await image.metadata();

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
        // Ensure output directory exists
        await ensureDirectoryExists(OUTPUT_DIR);

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