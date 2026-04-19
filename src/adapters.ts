import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

export type OCRProvider = 'mistral';

export interface OCRAdapter {
    providerName: string;
    capabilities: string[];
    processDocument(buffer: Buffer, fileName: string): Promise<unknown>;
}

class MistralOCRAdapter implements OCRAdapter {
    providerName = 'mistral';
    capabilities = ['pdf-ocr', 'image-extraction', 'markdown-output'];

    async processDocument(buffer: Buffer, fileName: string): Promise<unknown> {
        const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

        const uploaded_pdf = await client.files.upload({
            file: { fileName, content: buffer },
            purpose: 'ocr',
        });

        const signedUrl = await client.files.getSignedUrl({ fileId: uploaded_pdf.id });

        const ocrResponse = await client.ocr.process({
            model: 'mistral-ocr-latest',
            document: { type: 'document_url', documentUrl: signedUrl.url },
            includeImageBase64: true,
        });

        return ocrResponse;
    }
}

export function createOCRAdapter(provider: OCRProvider): OCRAdapter {
    if (provider === 'mistral') return new MistralOCRAdapter();
    throw new Error(`Proveedor OCR desconocido: ${provider}`);
}
