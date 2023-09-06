import { Response } from 'express';

export const notFound = (res: Response) => res.status(404).render('errors/404.njk');
