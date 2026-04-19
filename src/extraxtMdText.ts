//Extrae todas las páginas de markdown del json y las junta en un único archivo MD

import * as fs from 'fs';
import * as path from 'path';
import { OCRResponse } from './types';

export function extractMdText(data: OCRResponse): void {
    console.log("corriendo extractMdText...");
    const mdDir = path.join(process.cwd(), 'output', 'md');

    if (!fs.existsSync(mdDir)) {
        fs.mkdirSync(mdDir, { recursive: true });
    }

    let fullMarkdown = '';

    data.pages.forEach((page, index) => {
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
