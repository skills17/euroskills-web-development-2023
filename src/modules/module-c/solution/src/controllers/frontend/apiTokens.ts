import crypto from 'crypto';
import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../../utils/validation';
import { ApiToken } from '../../entities/ApiToken';
import { getWorkspace } from '../../services/workspace';
import { getApiToken } from '../../services/apiTokens';

const create = async (req: Request, res: Response) => {
  return res.render('apiTokens/create.njk');
};

const store = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().max(100, 'Name must be at most 100 characters').nonempty({ message: 'Name is required' }),
  });
  const errors = validate(schema, req.body);

  if (errors) {
    return res.render('apiTokens/create.njk', {
      errors,
      values: req.body,
    });
  }

  const workspace = await getWorkspace(req.params.workspaceId);

  const apiToken = new ApiToken();
  apiToken.name = req.body.name;
  apiToken.token = crypto.randomBytes(25).toString('hex'); // 25 bytes => 50 hex chars
  apiToken.workspace = workspace;
  await apiToken.save();

  return res.render('apiTokens/view.njk', {
    apiToken,
    workspace,
  });
};

const destroy = async (req: Request, res: Response) => {
  const workspace = await getWorkspace(req.params.workspaceId);
  const apiToken = await getApiToken(req.params.tokenId);

  if (workspace && apiToken && apiToken.workspace.id === workspace.id) {
    apiToken.revokedAt = new Date();
    await apiToken.save();
  }

  return res.redirect(`/workspaces/${workspace.id}?action=tokenRevoked`);
};

export default {
  create,
  store,
  destroy,
};
