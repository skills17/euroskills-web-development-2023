import { Express, Request, Response } from 'express';
import loginController from './controllers/login';
import logoutController from './controllers/logout';

export const setupRoutes = (app: Express) => {
  app.get('/login', loginController.get);
  app.post('/login', loginController.post);

  app.get('/logout', logoutController.get);

  app.get('/', (req: Request, res: Response) => res.redirect('/workspaces'));
};
