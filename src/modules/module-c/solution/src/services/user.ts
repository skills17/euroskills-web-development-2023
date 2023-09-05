import { Request } from 'express';
import { User } from '../entities/User'
import { verifyJwt } from '../utils/jwt';

export const getUser = async (username: string) => {
  return User.findOneBy({ username });
};

export const getUserFromRequest = async (req: Request) => {
  const token = verifyJwt<{ username: string }>(req.cookies.access_token);
  return User.findOneByOrFail({ username: token.username });
};
