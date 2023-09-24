import { NextFunction, Request, Response } from 'express';
import { getWorkspace } from '../services/workspace';
import { getUserFromRequest } from '../services/user';
import { notFound } from '../utils/views';

const validWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.workspaceId && req.params.workspaceId !== 'create') {
    const workspace = await getWorkspace(req.params.workspaceId);
    const user = await getUserFromRequest(req);

    if (!workspace || !user || workspace.user.id !== user.id) {
      return notFound(res);
    }
  }

  next();
};

export default validWorkspace;
