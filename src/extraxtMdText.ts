//Extrae todas las páginas de markdown del json y las junta en un único archivo MD

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

export function extractMdText(): void {
    console.log("corriendo extractMdText...");
    const data: JsonData = example2 as JsonData;
    const mdDir = path.join(process.cwd(), 'md');

    if (!fs.existsSync(mdDir)) {
        fs.mkdirSync(mdDir, { recursive: true });
    }

    let fullMarkdown = '';

    data.pages.forEach((page: Page, index: number) => {
        fullMarkdown += page.markdown;

        if (index < data.pages.length - 1) {
            fullMarkdown += '\n\n';
        }
    });

    const outputPath = path.join(mdDir, 'full_document.md');
    fs.writeFileSync(outputPath, fullMarkdown, 'utf-8');

    console.log(`\nDocumento markdown completo guardado en: ${outputPath}`);
    console.log(`Total de páginas procesadas: ${data.pages.length}`);
}

extractMdText();
