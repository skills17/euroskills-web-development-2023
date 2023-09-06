import {NextFunction, Request, Response} from "express";

export function unless(paths: string[], middleware: (req: Request, res: Response, next: NextFunction) => void): (req: Request, res: Response, next: NextFunction) => void {
    return function (req, res, next) {
        if (paths.some(path => req.path.startsWith(path))) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
}
