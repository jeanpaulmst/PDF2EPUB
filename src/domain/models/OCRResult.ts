export interface OCRImage {
    id: string;
    imageBase64: string;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
}

export interface OCRPage {
    index: number;
    text: string;
    markdown: string;
    images: OCRImage[];
    dimensions: {
        dpi: number;
        height: number;
        width: number;
    };
}

export interface OCRResult {
    pages: OCRPage[];
}
