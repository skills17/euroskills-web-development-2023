import {Request, Response} from "express";
import fetch from "node-fetch";
import * as crypto from "crypto";
import {ServiceUsage} from "../../entities/ServiceUsage";
import {Service} from "../../entities/Service";
import {ApiToken} from "../../entities/ApiToken";
import {serviceUnavailable} from "../../utils/service";

const CHATTERBLAST_BASE_URL = process.env.CHATTERBLAST_BASE_URL || 'http://127.0.0.1:9001'
console.log('CHATTERBLAST_BASE_URL', CHATTERBLAST_BASE_URL)

const conversations: {
    [conversationId: string]: {
        lastPromptTimestamp: Date,
        promptCount: number,
        promptsResponseCount: number,
        savedUsageCount: number,
    }
} = {};

function parseResponse(textResponse: string): { isFinal: boolean, durationInMs: number, text: string } {
    const responseParts = textResponse.split('<EOF>');
    if (responseParts.length > 1) {
        const words = textResponse.split(' ');
        const durationInMs = parseInt(words[words.length - 1].replace('ms', ''));
        return {
            isFinal: true,
            durationInMs,
            text: responseParts[0],
        }
    }

    return {
        isFinal: false,
        durationInMs: 0,
        text: textResponse
    }
}

async function readResponse(token: string, conversationId: string) {
    const response = await fetch(`${CHATTERBLAST_BASE_URL}/conversation/${conversationId}`);
    const textResponse = await response.text()

    const {isFinal, text, durationInMs} = parseResponse(textResponse);

    if (isFinal) {
        conversations[conversationId].promptsResponseCount = conversations[conversationId].promptCount;
        // save usage, but only once
        if (conversations[conversationId]?.promptCount > conversations[conversationId]?.savedUsageCount) {
            const serviceUsage = new ServiceUsage();
            serviceUsage.durationInMs = durationInMs;
            serviceUsage.service = await Service.findOneOrFail({where: {name: "ChatterBlast"}});
            serviceUsage.apiToken = await ApiToken.findOneOrFail({where: {token}})
            serviceUsage.usageStartedAt = conversations[conversationId].lastPromptTimestamp;
            await serviceUsage.save();
            conversations[conversationId].savedUsageCount = conversations[conversationId].promptCount
        }
    }

    return {
        conversation_id: conversationId,
        response: text,
        is_final: isFinal
    };
}

async function startConversation(req: Request, res: Response) {
    try {
        if (!req.body.prompt) {
            res.status(400).json({
                "type": "/problem/types/400",
                "title": "Bad Request",
                "status": 400,
                "detail": "Invalid request body",
            });
            return;
        }

        const conversationId = crypto.randomUUID();

        const creationResponse = await fetch(`${CHATTERBLAST_BASE_URL}/conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: `${conversationId}`
            })
        });

        if (creationResponse.status !== 201) {
            return serviceUnavailable(req, res);
        }

        conversations[conversationId] = {
            lastPromptTimestamp: new Date(),
            promptCount: 1,
            promptsResponseCount: 0,
            savedUsageCount: 0,
        }

        const postPromptResponse = await fetch(`${CHATTERBLAST_BASE_URL}/conversation/${conversationId}`, {
            method: 'POST',
            body: req.body.prompt || ''
        });

        if (postPromptResponse.status !== 200) {
            return serviceUnavailable(req, res);
        }

        res.json(await readResponse(req.header('X-API-TOKEN'), conversationId));
    } catch (error) {
        console.error('Error:', error);
        return serviceUnavailable(req, res);
    }
}

async function continueConversation(req: Request, res: Response) {

    const conversationId = req.params.conversationId;
    if (!conversations[conversationId]) {
        res.status(400).json({
            "type": "/problem/types/400",
            "title": "Bad Request",
            "status": 400,
            "detail": "The conversation does not exist.",
        });
        return;
    }

    if (conversations[conversationId].promptsResponseCount < conversations[conversationId].promptCount) {
        res.status(400).json({
            "type": "/problem/types/400",
            "title": "Bad Request",
            "status": 400,
            "detail": "The conversation is not ready for a new prompt.",
        })
        return;
    }

    conversations[conversationId].lastPromptTimestamp = new Date();
    conversations[conversationId].promptCount++;

    const postPromptResponse = await fetch(`${CHATTERBLAST_BASE_URL}/conversation/${conversationId}`, {
        method: 'POST',
        body: req.body.prompt || ''
    });

    if (postPromptResponse.status !== 200) {
        return serviceUnavailable(req, res);
    }

    res.json(await readResponse(req.header('X-API-TOKEN'), conversationId));
}

async function getResponse(req: Request, res: Response) {
    const conversationId = req.params.conversationId;
    if (!conversations[conversationId]) {
        res.status(404).json({
            "type": "/problem/types/404",
            "title": "Not Found",
            "status": 404,
            "detail": "The conversation does not exist.",
        });
        return;
    }
    res.json(await readResponse(req.header('X-API-TOKEN'), req.params.conversationId));
}

export default {
    startConversation,
    continueConversation,
    getResponse,
};
