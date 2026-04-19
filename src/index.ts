import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { createOCRAdapter, OCRProvider } from "./adapters";
import { OCRService } from "./services";
import { extractImages } from "./extractImages";
import { extractMdText } from "./extraxtMdText";
import { convertToEpub } from "./convertToEpub";
import { OCRResponse } from "./types";

dotenv.config();

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

const provider = (process.env.OCR_PROVIDER || 'mistral') as OCRProvider;
const ocrAdapter = createOCRAdapter(provider);
const ocrService = new OCRService(ocrAdapter);

app.get("/", (req: Request, res: Response) => {
  res.send(`PDF2EPUB API - Usando proveedor: ${ocrService.providerName}`);
});

app.get("/capabilities", (req: Request, res: Response) => {
  res.json({
    provider: ocrService.providerName,
    capabilities: ocrService.capabilities
  });
});

app.post("/process-pdf", upload.single('pdf'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "Se requiere un archivo PDF en el campo 'pdf'" });
            return;
        }

        const title = (req.body.title as string) || "documento";
        const pdfBuffer = req.file.buffer;
        const fileName = req.file.originalname || "document.pdf";

        const ocrResponse = await ocrService.processDocument(pdfBuffer, fileName) as OCRResponse;
        extractImages(ocrResponse);
        extractMdText(ocrResponse);
        const epubPath = convertToEpub(title);
        res.download(epubPath, `${title}.epub`);
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Error processing PDF" });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Proveedor OCR: ${ocrService.providerName}`);
});
