//Extrae las imagenes del json devuelto por mistral y los guarda en /images

import * as fs from 'fs';
import * as path from 'path';
import example2 from '../example2.json';

interface Image {
    id: string;
    imageBase64: string;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
    imageAnnotation: any;
}

interface Page {
    index: number;
    markdown: string;
    images: Image[];
    dimensions: {
        dpi: number;
        height: number;
        width: number;
    };
}

interface JsonData {
    pages: Page[];
}

function base64ToJPG(base64Data: string, outputPath: string): void {
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64String, 'base64');
    fs.writeFileSync(outputPath, buffer);
}

export function extractImages(): void {
    console.log("corriendo extractImages...");
    const data: JsonData = example2 as JsonData;
    const imagesDir = path.join(process.cwd(), 'images');

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    let totalImages = 0;

    data.pages.forEach((page: Page) => {
        page.images.forEach((image: Image) => {
            const imagePath = path.join(imagesDir, image.id);
            base64ToJPG(image.imageBase64, imagePath);
            totalImages++;
            console.log(`Imagen guardada: ${image.id}`);
        });
    });

    console.log(`\nTotal de imágenes extraídas: ${totalImages}`);
}

extractImages();