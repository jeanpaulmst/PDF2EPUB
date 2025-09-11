import dataJson from './../example2.json'
import fs from 'fs';

//Embeber las imagenes de una pagina del json

function embedImagesInMarkdown(page) {
    let markdownContent = page.markdown;
    const images = page.images || [];
    const dimensions = page.dimensions;
    
    // Si no tiwne imagenes, devuelve el md pelado
    if (images.length === 0) {
        return markdownContent;
    }
    
    let mdModificado = markdownContent;
    for (const image of images) {

        //Referencia de imagen en el string de md
        const imageMdReference = `(${image.id})`;    // Ej: ![img-0.jpeg](img-0.jpeg)
        console.log("refe: ", imageMdReference)
        console.log("base64: ", image.imageBase64)

        //Reemplazar la referencia con el string de base64
        mdModificado = mdModificado.replace(imageMdReference, "(" + image.imageBase64 + ")");
        // mdModificado = mdModificado.replace(imageMdReference, "!!!Lo reemplacé");
    }

    return mdModificado
}

// Iterar cada pagina de json y generar md completo
function concatEmbededMarkdowns(){

    /*
    let fullMarkdown = '';
    console.log("pages", Array.isArray(dataJson.pages))
    for(const page of dataJson.pages){
        console.log("pagina: ", page)
    }
    */

    //Por cada pagina, obtener md con imagenes ambebidas y concatenarlo al markdown completo
    let fullMarkdown = '';
    for(const page of dataJson.pages){
        const mdModificado = embedImagesInMarkdown(page)
        fullMarkdown = fullMarkdown + mdModificado + '\n\n';
    }

    return fullMarkdown
}

const md = concatEmbededMarkdowns();
fs.writeFile("./outputMDFiles/mdComplete.md", md, (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully!');
});

export default concatEmbededMarkdowns;
