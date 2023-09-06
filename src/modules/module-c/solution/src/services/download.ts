import fetch from "node-fetch";
import * as fs from "fs";
import crypto from "crypto";

// create `uploads` dir if not exist
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

function getExtension(url: string) {
    if (url.endsWith('.jpg')) {
        return '.jpg';
    }
    if (url.endsWith('.png')) {
        return '.png';
    }
    return '';
}

export default async function downloadFile(url: string): Promise<string> {
    const response = await fetch(url);
    const buffer = await response.buffer();
    // save file
    return new Promise<string>((resolve, reject) => {
        // get file extension from url
        const ext = getExtension(url);

        const filepath = `uploads/${crypto.randomUUID()}${ext}`;
        fs.writeFile(filepath, buffer, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(filepath);
        });
    })
}
