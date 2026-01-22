import { OCRPort, OCRCapabilities } from '../domain/ports/OCRPort';
import { OCRResult } from '../domain/models/OCRResult';

export class OCRService {
    constructor(private ocrAdapter: OCRPort) {}

    get providerName(): string {
        return this.ocrAdapter.providerName;
    }

    get capabilities(): OCRCapabilities {
        return this.ocrAdapter.capabilities;
    }

    async processDocument(document: Buffer, fileName: string): Promise<OCRResult> {
        return this.ocrAdapter.processDocument(document, fileName);
    }
}
