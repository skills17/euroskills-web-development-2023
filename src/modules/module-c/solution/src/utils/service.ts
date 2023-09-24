import {Request, Response} from "express";

export function serviceUnavailable(req: Request, res: Response) {
    res.status(503).send({
        "type": "/problem/types/503",
        "title": "Service Unavailable",
        "status": 503,
        "detail": "The service is currently unavailable."
    });
}
