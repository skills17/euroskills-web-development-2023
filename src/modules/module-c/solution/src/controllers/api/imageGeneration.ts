import {Request, Response} from "express";
import fetch from "node-fetch";
import downloadFile from "../../services/download";
import {serviceUnavailable} from "../../utils/service";

const DREAMWEAVER_BASE_URL = process.env.DREAMWEAVER_BASE_URL || 'http://127.0.0.1:9002'

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
            return serviceUnavailable(req, res);
        }

        const responseJson = await response.json();

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

    try {
        const response = await fetch(`${DREAMWEAVER_BASE_URL}/result/${jobId}`);
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
