import {Request, Response} from "express";
import * as fs from "fs";
import path from "path";

function file(req: Request, res: Response) {
    const localPath = path.resolve(req.path.replace('/files/', ''));
    if (fs.existsSync(localPath)) {
        res.sendFile(localPath);
    } else {
        res.status(404).send();
    }
}

export default {file};
