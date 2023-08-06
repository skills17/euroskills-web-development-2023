import { Express, Request, Response } from 'express';
import loginController from './controllers/login';
import logoutController from './controllers/logout';
import workspaceController from './controllers/workspace';

export const setupRoutes = (app: Express) => {
  app.get('/login', loginController.get);
  app.post('/login', loginController.post);

  app.get('/logout', logoutController.get);

  app.get('/workspaces', workspaceController.list);
  app.get('/workspaces/create', workspaceController.create);
  app.post('/workspaces/create', workspaceController.post);

  app.get('/', (req: Request, res: Response) => res.redirect('/workspaces'));
};
