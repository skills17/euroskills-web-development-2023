import { Workspace } from '../entities/Workspace';

export const getWorkspace = async (id: number | string) => {
  return Workspace.findOne({
    where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
    relations: ['user', 'apiTokens', 'billingQuota'],
  });
};
