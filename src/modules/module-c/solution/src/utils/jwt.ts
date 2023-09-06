import jwt from 'jsonwebtoken';

// should of course be read from the ENV in reality, but this should simplify it a bit for us
const secret = 'B6EGGa61KgQKluRnuZCxKKZOJg9OO8cfME9SULhA2Bv3Gpd8qYE5cbFoWAFzNhk';

export const signToken = (data: any, subject?: string) => jwt.sign(data, secret, {
  expiresIn: '3d',
  subject,
});

export const verifyJwt = <T>(token: string) => jwt.verify(token, secret) as T;
