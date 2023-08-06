import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../utils/validation';
import { Workspace } from '../entities/Workspace';
import { getUserFromRequest } from '../services/user';

const list = async (req: Request, res: Response) => {
  const user = await getUserFromRequest(req);
  const workspaces = await Workspace.findBy({ user: { id: user.id }});

  return res.render('workspaces/list.njk', {
    title: 'Workspaces',
    workspaces,
  });
};

const create = async (req: Request, res: Response) => {
  return res.render('workspaces/create.njk', {
    title: 'Create Workspace',
  });
};

const post = async (req: Request, res: Response) => {
  const schema = z.object({
    title: z.string().max(100, 'Title must be at most 100 characters').nonempty({ message: 'Title is required' }),
    description: z.string().optional(),
  });
  const errors = validate(schema, req.body);

  const sendError = (e) => res.render('workspaces/create.njk', {
    title: 'Create Workspace',
    errors: e,
    values: req.body,
  });

  if (errors) {
    return sendError(errors);
  }

  // check if a workspace with this title already exists
  const user = await getUserFromRequest(req);
  const existing = await Workspace.findOneBy({ title: req.body.title, user: { id: user.id }});
  if (existing) {
    return sendError({ title: 'A workspace with this title already exists' });
  }

  const workspace = new Workspace();
  workspace.title = req.body.title;
  workspace.description = req.body.description || null;
  workspace.user = user;
  await workspace.save();

  return res.redirect('/workspaces');
}

export default {
  list,
  create,
  post,
};
