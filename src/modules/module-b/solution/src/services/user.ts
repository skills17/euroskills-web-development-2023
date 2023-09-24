import { Request } from 'express';
import { User } from '../entities/User'
import { verifyToken } from '../utils/jwt';

export const getUser = async (username: string) => {
  return User.findOneBy({ username });
};

export const getUserFromRequest = async (req: Request) => {
  const token = verifyToken<{ username: string }>(req.cookies.access_token);
  return User.findOneByOrFail({ username: token.username });
};
