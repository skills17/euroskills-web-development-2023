import { Request, Response } from 'express';
import { z } from 'zod';
import { getUser } from '../../services/user';
import { validate } from '../../utils/validation';
import { verifyHash } from '../../utils/hashing';
import { signToken } from '../../utils/jwt';

const get = async (req: Request, res: Response) => {
  return res.render('auth/login.njk');
};

const post = async (req: Request, res: Response) => {
  const schema = z.object({
    username: z.string().nonempty({ message: 'Username is required' }),
    password: z.string().nonempty({ message: 'Password is required' }),
  });
  const errors = validate(schema, req.body);

  if (errors) {
    return res.render('auth/login.njk', {
      errors,
    });
  }

  const user = await getUser(req.body.username);

  if (!user || !(await verifyHash(req.body.password, user.password))) {
    return res.render('auth/login.njk', {
      loginFailed: true,
    });
  }

  const token = signToken({ username: req.body.username }, `${user.id}`);
  return res.cookie('access_token', token, {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  }).redirect('/');
};

export default {
  get,
  post,
};
