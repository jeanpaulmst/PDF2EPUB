import data from './../outputMDFiles/data.json'
import marked from "marked"

const convertMdToHTML = (jsonString: string) => {
    const html = marked(jsonString);
    return html
}

console.log(convertMdToHTML(data.mdString))

export { convertMdToHTML }