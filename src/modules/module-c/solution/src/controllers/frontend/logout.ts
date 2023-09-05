import { Request, Response } from 'express';

const get = async (req: Request, res: Response) => res.clearCookie('access_token').redirect('/login');

export default {
  get,
};
