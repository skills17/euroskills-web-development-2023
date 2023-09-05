import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../../utils/validation';
import { getWorkspace } from '../../services/workspace';
import { BillingQuota } from '../../entities/BillingQuota';

const edit = async (req: Request, res: Response) => {
  const workspace = await getWorkspace(req.params.workspaceId);
  return res.render('billingQuotas/edit.njk', {
    workspace,
    values: {
      limit: workspace.billingQuota?.limit,
    },
  });
};

const update = async (req: Request, res: Response) => {
  const schema = z.object({
    limit: z.coerce.number(),
  });
  const errors = validate(schema, req.body);

  if (errors) {
    return res.render('billingQuotas/edit.njk', {
      errors,
      values: req.body,
    });
  }

  const workspace = await getWorkspace(req.params.workspaceId);

  if (req.body.limit) {
    const quota = workspace.billingQuota || new BillingQuota();
    quota.limit = parseFloat(req.body.limit);
    quota.updatedAt = new Date();
    await quota.save();

    if (!workspace.billingQuota) {
      workspace.billingQuota = quota;
      await workspace.save();
    }
  } else if (workspace.billingQuota) {
    const quota = workspace.billingQuota;
    workspace.billingQuota = null;
    await workspace.save();
    await quota.remove();
  }

  return res.redirect(`/workspaces/${workspace.id}?action=quotaUpdated`);
};

export default {
  edit,
  update,
};
