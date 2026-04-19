import { OCRAdapter } from './adapters';

export class OCRService {
    private adapter: OCRAdapter;

    get providerName(): string { return this.adapter.providerName; }
    get capabilities(): string[] { return this.adapter.capabilities; }

    constructor(adapter: OCRAdapter) {
        this.adapter = adapter;
    }

    async processDocument(buffer: Buffer, fileName: string): Promise<unknown> {
        return this.adapter.processDocument(buffer, fileName);
    }
}
