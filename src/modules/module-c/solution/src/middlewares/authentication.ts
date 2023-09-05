import {NextFunction, Request, Response} from 'express';
import {verifyJwt} from '../utils/jwt';
import {isValidToken} from "../services/apiTokens";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/login') {
        const token = req.cookies.access_token;
        try {
            verifyJwt(token);
            next();
        } catch (e) {
            res.redirect('/login');
        }
    } else {
        next();
    }
};

const tokenAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('X-API-TOKEN');
    isValidToken(token).then(isValid => {
        if (isValid) {
            next();
            return;
        }
        res
            .status(401)
            .contentType("application/problem+json")
            .json({
                "type": "/problem/types/401",
                "title": "Unauthorized",
                "status": 401,
                "detail": "The header X-API-TOKEN is missing or invalid."
            });
    });
}

export {userAuth, tokenAuth};
