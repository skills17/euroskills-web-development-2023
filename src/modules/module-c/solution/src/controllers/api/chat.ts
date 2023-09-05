import {Request, Response} from "express";

function startConversation(req: Request, res: Response) {
    res.json({});
}

function continueConversation(req: Request, res: Response) {
    res.json({});
}

function getResponse(req: Request, res: Response) {
    res.json({});
}

export default {
    startConversation,
    continueConversation,
    getResponse,
};
