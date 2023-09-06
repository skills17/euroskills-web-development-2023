import {NextFunction, Request, Response} from "express";
import {isQuotaExceeded} from "../services/apiTokens";

const quotaCheck = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('X-API-TOKEN');
    isQuotaExceeded(token).then(isExceeded => {
        if (!isExceeded) {
            next();
            return;
        }
        res
            .status(403)
            .contentType("application/problem+json")
            .json({
                "type": "/problem/types/403",
                "title": "Quota Exceeded",
                "status": 403,
                "detail": "You have exceeded your quota."
            });
    });
};

export default quotaCheck;
