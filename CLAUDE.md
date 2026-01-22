# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PDF2EPUB is a TypeScript tool that converts scanned PDF books into EPUB format for e-readers like Kindle. It uses Mistral AI's OCR API to extract text from scanned pages.

## Commands

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start the server (requires build first)
npm start

# Run tests
npm test

# Convert markdown to EPUB (requires Pandoc installed)
convert.bat
```

## Architecture

### Pipeline Flow
1. **OCR Processing** (`processMistralOCR.ts`) - Uploads PDF to Mistral API, performs OCR, returns JSON with markdown content and embedded images
2. **Image Extraction** (`extractImages.ts`) - Extracts base64-encoded images from OCR JSON, saves as JPG files to `/images`
3. **Markdown Extraction** (`extraxtMdText.ts`) - Concatenates all page markdown from OCR JSON into single `full_document.md`
4. **EPUB Conversion** (`convert.bat`) - Uses Pandoc to convert markdown to EPUB with `--webtex` for math rendering

### Express Server
The server (`index.ts`) exposes:
- `GET /` - Health check
- `POST /process-pdf` - Triggers OCR processing pipeline

### Key Data Structure
The OCR JSON response contains:
```typescript
interface Page {
    index: number;
    markdown: string;
    images: Image[];  // Contains id, imageBase64, coordinates
    dimensions: { dpi, height, width };
}
```

## Environment Variables

Required in `.env`:
- `MISTRAL_API_KEY` - Mistral AI API key for OCR
- `TEST_DOC_PATH` - Path to PDF file for testing

## External Dependencies

- **Pandoc** - Required for markdown-to-EPUB conversion (not bundled, must be installed separately)
