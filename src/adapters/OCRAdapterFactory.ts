import { OCRPort } from '../domain/ports/OCRPort';
import { MistralOCRAdapter } from './mistral/MistralOCRAdapter';

export type OCRProvider = 'mistral' | 'google' | 'tesseract';

export function createOCRAdapter(provider: OCRProvider): OCRPort {
    switch (provider) {
        case 'mistral':
            const apiKey = process.env.MISTRAL_API_KEY;
            if (!apiKey) {
                throw new Error('MISTRAL_API_KEY environment variable is required');
            }
            return new MistralOCRAdapter(apiKey);

        case 'google':
            throw new Error('Google Vision adapter not implemented yet');

        case 'tesseract':
            throw new Error('Tesseract adapter not implemented yet');

        default:
            throw new Error(`OCR provider "${provider}" not supported`);
    }
}
