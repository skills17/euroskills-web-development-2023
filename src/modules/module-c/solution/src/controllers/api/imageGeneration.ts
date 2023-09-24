import {Request, Response} from "express";
import fetch from "node-fetch";
import downloadFile from "../../services/download";
import {serviceUnavailable} from "../../utils/service";
import {ServiceUsage} from "../../entities/ServiceUsage";
import {Service} from "../../entities/Service";
import {ApiToken} from "../../entities/ApiToken";

const DREAMWEAVER_BASE_URL = process.env.DREAMWEAVER_BASE_URL || 'http://127.0.0.1:9002'
console.log('DREAMWEAVER_BASE_URL', DREAMWEAVER_BASE_URL)

const jobs: {
    [jobId: string]: {
        start: Date,
        savedUsage: boolean,
    }
} = {};

async function generate(req: Request, res: Response) {
    try {
        if (!req.body.text_prompt) {
            res.status(400).json({
                "type": "/problem/types/400",
                "title": "Bad Request",
                "status": 400,
                "detail": "Invalid request body",
            });
            return;
        }

        const response = await fetch(`${DREAMWEAVER_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text_prompt: req.body.text_prompt,
            }),
        });


        if (response.status !== 201) {
            console.log('req url', `${DREAMWEAVER_BASE_URL}/generate`)
            console.log('response.status', response.status)
            console.log('response.body', `${JSON.stringify(response.body)}`)
            return serviceUnavailable(req, res);
        }

        const responseJson = await response.json();

        jobs[responseJson.job_id] = {start: new Date(), savedUsage: false};

        res.json({
            job_id: responseJson.job_id,
        });
    } catch (error) {
        console.error('Error:', error);
        return serviceUnavailable(req, res);
    }
}

async function getJobStatus(req: Request, res: Response) {
    const jobId = req.params.jobId;
    if (!jobId) {
        res.status(400).json({
            "type": "/problem/types/400",
            "title": "Bad Request",
            "status": 400,
            "detail": "Missing jobId parameter",
        });
        return;
    }

    try {
        const response = await fetch(`${DREAMWEAVER_BASE_URL}/status/${jobId}`);
        if (response.status === 400) {
            res.status(404).json({
                "type": "/problem/types/404",
                "title": "Bad Request",
                "status": 404,
                "detail": "The requested job was not found."
            });
            return;
        }
        const responseJson = await response.json();

        const filepath = await downloadFile(responseJson.image_url);
        const imageUrl = `${req.protocol}://${req.get('host')}/files/${filepath}`;

        res.json({
            "status": responseJson.status,
            "progress": responseJson.progress,
            "image_url": imageUrl,
        });
    } catch (error) {
        console.error(error);
        return serviceUnavailable(req, res);
    }
}

async function getResult(req: Request, res: Response) {
    const jobId = req.params.jobId;
    if (!jobId) {
        res.status(400).json({
            "type": "/problem/types/400",
            "title": "Bad Request",
            "status": 400,
            "detail": "Missing jobId parameter",
        });
        return;
    }
    if (!jobs[jobId]) {
        res.status(404).json({
            "type": "/problem/types/404",
            "title": "Bad Request",
            "status": 404,
            "detail": "The requested job was not found."
        });
        return;
    }

    try {
        const response = await fetch(`${DREAMWEAVER_BASE_URL}/result/${jobId}`);
        if (response.status === 400) {
            res.status(404).json({
                "type": "/problem/types/404",
                "title": "Bad Request",
                "status": 404,
                "detail": "The requested job was not found or is not finished."
            });
            return;
        }
        const responseJson = await response.json();

        if (!jobs[jobId].savedUsage) {
            const durationInMs = (new Date(responseJson.finished_at)).getTime() - jobs[jobId].start.getTime();
            const serviceUsage = new ServiceUsage();
            serviceUsage.durationInMs = durationInMs;
            serviceUsage.service = await Service.findOneOrFail({where: {name: "DreamWeaver"}});
            serviceUsage.apiToken = await ApiToken.findOneOrFail({where: {token: req.header('X-API-TOKEN')}})
            serviceUsage.usageStartedAt = jobs[jobId].start;
            await serviceUsage.save();
            jobs[jobId].savedUsage = true;
        }

        const filepath = await downloadFile(responseJson.image_url);
        const imageUrl = `${req.protocol}://${req.get('host')}/files/${filepath}`;

        res.json({
            "resource_id": responseJson.resource_id,
            "image_url": imageUrl,
        });
    } catch (error) {
        console.error(error);
        return serviceUnavailable(req, res);
    }
}

async function triggerResourceAction(req: Request, res: Response, action: 'upscale' | 'zoom/in' | 'zoom/out') {
    try {
        const response = await fetch(`${DREAMWEAVER_BASE_URL}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resource_id: req.body.resource_id,
            }),
        });

        if (response.status === 400) {
            res.status(404).json({
                "type": "/problem/types/404",
                "title": "Not Found",
                "status": 404,
                "detail": "The requested resource was not found."
            })
            return;
        }

        if (response.status === 500) {
            return serviceUnavailable(req, res);
        }

        const json = await response.json();
        jobs[json.job_id] = {start: new Date(), savedUsage: false};
        res.json(json);
    } catch (error) {
        console.error(error);
        return serviceUnavailable(req, res);
    }
}

function upscale(req: Request, res: Response) {
    triggerResourceAction(req, res, 'upscale');
}

function zoomIn(req: Request, res: Response) {
    triggerResourceAction(req, res, 'zoom/in');
}

function zoomOut(req: Request, res: Response) {
    triggerResourceAction(req, res, 'zoom/out');
}

export default {
    generate,
    getJobStatus,
    getResult,
    upscale,
    zoomIn,
    zoomOut,
};
