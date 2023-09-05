import {Request, Response} from "express";
import FormData from "form-data";
import * as fs from "fs";
import fetch from "node-fetch";
import {ServiceUsage} from "../../entities/ServiceUsage";
import {Service} from "../../entities/Service";
import {ApiToken} from "../../entities/ApiToken";

async function recognize(req: Request, res: Response) {

    try {
        // Create a FormData object and append the file from the multipart form
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        const start = new Date();

        // Forward the FormData to the external endpoint using node-fetch
        const response = await fetch('http://127.0.0.1:9003/recognize', {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders(),
            },
        });

        const serviceUsage = new ServiceUsage();
        serviceUsage.durationInMs = new Date().getTime() - start.getTime();
        serviceUsage.service = await Service.findOneOrFail({where: {name: "MindReader"}});
        serviceUsage.apiToken = await ApiToken.findOneOrFail({where: {token: req.header('X-API-TOKEN')}})
        serviceUsage.usageStartedAt = start;
        await serviceUsage.save();

        // Parse the response from the external endpoint
        const parsedData = await response.json();

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
