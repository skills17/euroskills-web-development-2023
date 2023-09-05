import {NextFunction, Request, Response} from "express";

export function unless(path: string, middleware: (req: Request, res: Response, next: NextFunction) => void): (req: Request, res: Response, next: NextFunction) => void {
    return function (req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
}
