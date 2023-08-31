import { Workspace } from '../entities/Workspace';
import { getApiTokenUsagePerService } from './apiTokens';
import { getAllServices } from './services';

export const getBill = async (workspace: Workspace, year: number, month: number) => {
  const apiTokens = await Promise.all(workspace.apiTokens.map(async (token) => ({
    token,
    usages: await getApiTokenUsagePerService(token, year, month),
  })));
  const services = (await getAllServices()).reduce((all, service) => ({ ...all, [service.id]: service }), {});
  const total = apiTokens.reduce((totalCost, token) =>
    totalCost + token.usages.reduce((totalToken, usage) =>
      totalToken + usage.durationInMs * services[usage.serviceId].costPerMs
    , 0)
  , 0);

  return {
    apiTokens,
    services,
    total,
  };
};
