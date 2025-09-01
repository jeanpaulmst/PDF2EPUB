import express, { Request, Response } from "express";
import getJsonMd from "./getJsonMd";

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hola mundo con Express y TypeScript 🚀");
});

app.post("/process-pdf", async (req: Request, res: Response) => {

    try {
        const ocrResponse = await getJsonMd();
        res.json(ocrResponse);
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Error processing PDF" });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
