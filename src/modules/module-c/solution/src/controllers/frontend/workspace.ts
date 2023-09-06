import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../../utils/validation';
import { Workspace } from '../../entities/Workspace';
import { getUserFromRequest } from '../../services/user';
import { getWorkspace } from '../../services/workspace';
import { addMonths, differenceInMonths, formatDuration, intervalToDuration, startOfMonth } from 'date-fns';
import { getBill } from '../../services/bills';

const schema = z.object({
  title: z.string().max(100, 'Title must be at most 100 characters').nonempty({ message: 'Title is required' }),
  description: z.string().optional(),
});

const index = async (req: Request, res: Response) => {
  const user = await getUserFromRequest(req);
  const workspaces = await Workspace.findBy({ user: { id: user.id }});

  return res.render('workspaces/list.njk', {
    workspaces,
  });
};

const create = async (req: Request, res: Response) => {
  return res.render('workspaces/create.njk');
};

const store = async (req: Request, res: Response) => {
  const errors = validate(schema, req.body);

  const sendError = (e) => res.render('workspaces/create.njk', {
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

  return res.redirect(`/workspaces/${workspace.id}`);
};

const show = async (req: Request, res: Response) => {
  const workspace = await getWorkspace(req.params.workspaceId);
  const { total: costsCurrentMonth } = await getBill(workspace, new Date().getFullYear(), new Date().getMonth() + 1);
  const daysLeftCurrentMonth = formatDuration(
    intervalToDuration({ start: new Date(), end: startOfMonth(addMonths(new Date(), 1)) }),
    { format: ['days'] },
  ) || '1 day';
  const firstMonth = startOfMonth(workspace.createdAt);
  const numBills = Math.abs(differenceInMonths(firstMonth, startOfMonth(new Date()))) + 1;
  const bills = [...Array(numBills).keys()].map((i) => addMonths(firstMonth, i)).reverse();

  return res.render('workspaces/view.njk', {
    workspace,
    action: req.query.action,
    costsCurrentMonth,
    daysLeftCurrentMonth,
    bills,
  });
};

const edit = async (req: Request, res: Response) => {
  const workspace = await getWorkspace(req.params.workspaceId);

  return res.render('workspaces/edit.njk', {
    workspace,
    values: workspace,
  });
};

const update = async (req: Request, res: Response) => {
  const workspace = await getWorkspace(req.params.workspaceId);
  const errors = validate(schema, req.body);

  const sendError = (e) => res.render('workspaces/create.njk', {
    workspace,
    errors: e,
    values: req.body,
  });

  if (errors) {
    return sendError(errors);
  }

  // check if a workspace with this title already exists which is not this one
  const user = await getUserFromRequest(req);
  const existing = await Workspace.findOneBy({ title: req.body.title, user: { id: user.id }});
  if (existing && existing.id !== workspace.id) {
    return sendError({ title: 'A workspace with this title already exists' });
  }

  workspace.title = req.body.title;
  workspace.title = req.body.title;
  workspace.description = req.body.description || null;
  await workspace.save();

  return res.redirect(`/workspaces/${workspace.id}?action=workspaceUpdated`);
};

export default {
  index,
  create,
  store,
  show,
  edit,
  update,
};
