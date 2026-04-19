export interface Image {
    id: string;
    imageBase64: string;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
    imageAnnotation: any;
}

export interface Page {
    index: number;
    markdown: string;
    images: Image[];
    dimensions: {
        dpi: number;
        height: number;
        width: number;
    };
}

export interface OCRResponse {
    pages: Page[];
}
