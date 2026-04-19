#!/bin/bash

echo "Iniciando proceso de conversion a EPUB..."
echo

pandoc dist/md/full_document.md -o dist/libro.epub --webtex --resource-path=dist/images --metadata title="Tu Titulo" --metadata author="Autor"

if [ $? -eq 0 ]; then
    echo
    echo "Proceso completado. EPUB generado en dist/libro.epub"
else
    echo
    echo "Error en la conversion. Codigo de error: $?"
fi
