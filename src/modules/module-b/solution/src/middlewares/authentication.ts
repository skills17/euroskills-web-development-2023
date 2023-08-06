import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.path !== '/login') {
    const token = req.cookies.access_token;
    try {
      verifyToken(token);
      next();
    } catch (e) {
      res.redirect('/login');
    }
  }
}

export default auth;
