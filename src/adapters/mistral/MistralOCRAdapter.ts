import { Mistral } from '@mistralai/mistralai';
import { OCRPort, OCRCapabilities } from '../../domain/ports/OCRPort';
import { OCRResult } from '../../domain/models/OCRResult';

export class MistralOCRAdapter implements OCRPort {
    private client: Mistral;

    readonly providerName = 'Mistral OCR';

    readonly capabilities: OCRCapabilities = {
        supportsMarkdown: true,
        supportsImageExtraction: true,
        supportsMathFormulas: true,
        supportsTableDetection: true
    };

    constructor(apiKey: string) {
        this.client = new Mistral({ apiKey });
    }

    async processDocument(document: Buffer, fileName: string): Promise<OCRResult> {
        const uploadedPdf = await this.client.files.upload({
            file: { fileName, content: document },
            purpose: "ocr"
        });

        const signedUrl = await this.client.files.getSignedUrl({
            fileId: uploadedPdf.id,
        });

        const response = await this.client.ocr.process({
            model: "mistral-ocr-latest",
            document: {
                type: "document_url",
                documentUrl: signedUrl.url,
            },
            includeImageBase64: true
        });

        return this.mapToOCRResult(response);
    }

    private mapToOCRResult(response: any): OCRResult {
        return {
            pages: response.pages.map((page: any, index: number) => ({
                index,
                text: this.extractPlainText(page.markdown),
                markdown: page.markdown,
                images: page.images.map((img: any) => ({
                    id: img.id,
                    imageBase64: img.imageBase64,
                    topLeftX: img.topLeftX,
                    topLeftY: img.topLeftY,
                    bottomRightX: img.bottomRightX,
                    bottomRightY: img.bottomRightY,
                })),
                dimensions: page.dimensions
            }))
        };
    }

    private extractPlainText(markdown: string): string {
        return markdown
            .replace(/#{1,6}\s?/g, '')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
    }
}
