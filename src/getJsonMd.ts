import { Mistral } from '@mistralai/mistralai';
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config();

const getJsonMd = async () => {

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

    /*
    //concatenar los chunks del markdown devuelto
    const concatMarkdowns = () => {
        let markdown : string = ""
        ocrResponse.pages.forEach((chunk) => {

            markdown = markdown + ' ' + chunk.markdown
        })
        return markdown
    }

    const finalMarkdown = concatMarkdowns();
    
    return finalMarkdown
    */
    return ocrResponse
}

export default getJsonMd