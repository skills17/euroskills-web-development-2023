import { ApiToken } from '../entities/ApiToken';

export const getApiToken = async (id: number | string) => {
  return ApiToken.findOne({
    where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
    relations: ['workspace'],
  });
};
