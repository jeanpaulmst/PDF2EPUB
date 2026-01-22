import { OCRResult } from '../models/OCRResult';

export interface OCRCapabilities {
    supportsMarkdown: boolean;
    supportsImageExtraction: boolean;
    supportsMathFormulas: boolean;
    supportsTableDetection: boolean;
}

export interface OCRPort {
    readonly providerName: string;
    readonly capabilities: OCRCapabilities;
    processDocument(document: Buffer, fileName: string): Promise<OCRResult>;
}
