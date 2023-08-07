import { Express, Request, Response } from 'express';
import loginController from './controllers/login';
import logoutController from './controllers/logout';
import workspaceController from './controllers/workspace';
import apiTokensController from './controllers/apiTokens';
import billingQuotasController from './controllers/billingQuotas';
import authentication from './middlewares/authentication';
import validWorkspace from './middlewares/validWorkspace';
import { notFound } from './utils/views';

export const setupRoutes = (app: Express) => {
  // middlewares
  app.use(authentication);
  app.use('/workspaces/:workspaceId', validWorkspace)

  // routes
  app.get('/login', loginController.get);
  app.post('/login', loginController.post);

  app.get('/logout', logoutController.get);

  app.get('/workspaces', workspaceController.index);
  app.get('/workspaces/create', workspaceController.create);
  app.post('/workspaces/create', workspaceController.store);
  app.get('/workspaces/:workspaceId', workspaceController.show);
  app.get('/workspaces/:workspaceId/edit', workspaceController.edit);
  app.post('/workspaces/:workspaceId/edit', workspaceController.update);

  app.get('/workspaces/:workspaceId/tokens/create', apiTokensController.create);
  app.post('/workspaces/:workspaceId/tokens/create', apiTokensController.store);
  app.post('/workspaces/:workspaceId/tokens/:tokenId/revoke', apiTokensController.destroy);

  app.get('/workspaces/:workspaceId/quota', billingQuotasController.edit);
  app.post('/workspaces/:workspaceId/quota', billingQuotasController.update);

  app.get('/', (req: Request, res: Response) => res.redirect('/workspaces'));

  // 404
  app.get('*', (req: Request, res: Response) => notFound(res));
};
