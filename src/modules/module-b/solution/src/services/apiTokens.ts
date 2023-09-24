import { addMonths, format } from 'date-fns';
import { ApiToken } from '../entities/ApiToken';
import { ServiceUsage } from '../entities/ServiceUsage';

export const getApiToken = async (id: number | string) => {
  return ApiToken.findOne({
    where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
    relations: ['workspace'],
  });
};

export const getApiTokenUsagePerService = async (apiToken: ApiToken, year: number, month: number): Promise<{ serviceId: number, durationInMs: number }[]> => {
  const from = new Date(`${year}-${month}-01`);
  const to = addMonths(from, 1);
  return (await ServiceUsage.getRepository()
    .query('SELECT service_id, SUM(duration_in_ms) AS duration FROM `service_usages` WHERE api_token_id = ? AND usage_started_at >= ? AND usage_started_at < ? GROUP BY service_id', [
      apiToken.id,
      format(from, 'yyyy-MM-dd'),
      format(to, 'yyyy-MM-dd')
    ])).map(({ service_id, duration }) => ({
      serviceId: service_id,
      durationInMs: parseInt(duration),
    }));
};
