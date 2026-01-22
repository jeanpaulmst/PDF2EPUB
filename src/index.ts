import express, { Request, Response } from "express";
import fs from "fs";
import dotenv from "dotenv";
import { createOCRAdapter, OCRProvider } from "./adapters";
import { OCRService } from "./services";

dotenv.config();

const app = express();
const PORT = 3000;

// Crear servicio OCR con el proveedor configurado
const provider = (process.env.OCR_PROVIDER || 'mistral') as OCRProvider;
const ocrAdapter = createOCRAdapter(provider);
const ocrService = new OCRService(ocrAdapter);

app.get("/", (req: Request, res: Response) => {
  res.send(`PDF2EPUB API - Usando proveedor: ${ocrService.providerName}`);
});

// Endpoint para ver las capacidades del proveedor actual
app.get("/capabilities", (req: Request, res: Response) => {
  res.json({
    provider: ocrService.providerName,
    capabilities: ocrService.capabilities
  });
});

//Recibe archivo PDF y devuelve el JSON con markdown
app.post("/process-pdf", async (req: Request, res: Response) => {
    try {
        // Por ahora usa TEST_DOC_PATH del .env (como el original)
        const pdfPath = process.env.TEST_DOC_PATH;
        if (!pdfPath) {
            res.status(400).json({ error: "TEST_DOC_PATH not configured" });
            return;
        }

        const pdfBuffer = fs.readFileSync(pdfPath);
        const fileName = pdfPath.split(/[/\\]/).pop() || "document.pdf";

        const ocrResponse = await ocrService.processDocument(pdfBuffer, fileName);
        res.json(ocrResponse);
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Error processing PDF" });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Proveedor OCR: ${ocrService.providerName}`);
});
