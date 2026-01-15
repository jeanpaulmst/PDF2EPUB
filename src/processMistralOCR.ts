import { Mistral } from '@mistralai/mistralai';
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config();

// Función para procesar un documento PDF usando la API de Mistral OCR
const processMistralOCR = async () => {

    const apiKey = process.env.MISTRAL_API_KEY;
    const client = new Mistral({apiKey: apiKey});
    const pdfPath = process.env.TEST_DOC_PATH;

    //Para testear
    const uploaded_file = fs.readFileSync(pdfPath);

    const uploaded_pdf = await client.files.upload({
        file: {
            fileName: "uploaded_file.pdf",
            content: uploaded_file,
        },
        purpose: "ocr"
    });
    
    const signedUrl = await client.files.getSignedUrl({
        fileId: uploaded_pdf.id,
    });

    //procesar pdf, da como resultado un json con el markdown (da distintos chunks de un mismo archivo markdown)
    const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "document_url",
            documentUrl: signedUrl.url,
        },
        includeImageBase64: true
    });

    return ocrResponse
}

export default processMistralOCR