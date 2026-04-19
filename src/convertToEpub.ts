import { execSync } from 'child_process';
import * as path from 'path';
import * as os from 'os';

export function convertToEpub(title: string): string {
    const outputDir = path.join(process.cwd(), 'output');
    const inputPath = path.join(outputDir, 'md', 'full_document.md');
    const safeTitle = title.replace(/[^a-z0-9_\-]/gi, '_');
    const outputPath = path.join(outputDir, `${safeTitle}.epub`);
    const resourcePath = path.join(outputDir, 'images');
    const cssPath = path.join(process.cwd(), 'src', 'epub.css');

    const isWindows = os.platform() === 'win32';

    const inputArg = isWindows ? inputPath.replace(/\//g, '\\') : inputPath;
    const outputArg = isWindows ? outputPath.replace(/\//g, '\\') : outputPath;
    const resourceArg = isWindows ? resourcePath.replace(/\//g, '\\') : resourcePath;
    const cssArg = isWindows ? cssPath.replace(/\//g, '\\') : cssPath;

    const command = `pandoc "${inputArg}" -o "${outputArg}" --mathml --css="${cssArg}" --resource-path="${resourceArg}" --metadata title="${title}" --metadata author="Autor"`;

    execSync(command);

    return outputPath;
}
