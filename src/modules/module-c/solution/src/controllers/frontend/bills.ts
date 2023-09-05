import { Request, Response } from 'express';
import { getWorkspace } from '../../services/workspace';
import { notFound } from '../../utils/views';
import { getBill } from '../../services/bills';
import { format } from 'date-fns';

const show = async (req: Request, res: Response) => {
  const workspace = await getWorkspace(req.params.workspaceId);
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  if (!workspace || !year || !month) {
    return notFound(res);
  }

  const { apiTokens, services, total } = await getBill(workspace, year, month);

  return res.render('bills/view.njk', {
    workspace,
    apiTokens,
    services,
    year,
    month,
    monthName: format(new Date(`${year}-${month}-01`), 'MMMM'),
    total,
  });
};

export default {
  show,
};
