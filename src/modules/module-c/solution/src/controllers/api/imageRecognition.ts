import {Request, Response} from "express";
import FormData from "form-data";
import * as fs from "fs";
import fetch from "node-fetch";

async function recognize(req: Request, res: Response) {

    try {
        // Create a FormData object and append the file from the multipart form
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        // Forward the FormData to the external endpoint using node-fetch
        const response = await fetch('http://127.0.0.1:9003/recognize', {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Parse the response from the external endpoint
        const parsedData = await response.json();
        console.log('parsedData', parsedData.objects)

        res.send({
            objects: parsedData.objects.map(obj => ({
                name: obj.label,
                probability : obj.probability,
                bounding_box: {
                    x: obj.bounding_box.left,
                    y: obj.bounding_box.top,
                    width: obj.bounding_box.right - obj.bounding_box.left,
                    height: obj.bounding_box.bottom - obj.bounding_box.top,
                }}))
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(503).send({
            "type": "/problem/types/503",
            "title": "Service Unavailable",
            "status": 503,
            "detail": "The service is currently unavailable."
        });
    }
}

export default {recognize};
