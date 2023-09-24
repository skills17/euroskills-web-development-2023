import {addMonths, format} from 'date-fns';
import {ApiToken} from '../entities/ApiToken';
import {ServiceUsage} from '../entities/ServiceUsage';
import {getBill} from "./bills";

export const getApiToken = async (id: number | string) => {
    return ApiToken.findOne({
        where: {id: typeof id === 'string' ? parseInt(id, 10) : id},
        relations: ['workspace'],
    });
};

export const isValidToken = async (token: string) => {
    return !!(await ApiToken.findOne({
        where: {token},
    }));
};

export const isQuotaExceeded = async (token: string) => {
    const apiToken = await ApiToken.findOne({
        where: {token},
        relations: ['workspace', 'workspace.apiTokens', 'workspace.billingQuota'],
    });

    if (!apiToken.workspace.billingQuota) {
        return false;
    }

    const date = new Date();
    const bill = await getBill(apiToken.workspace, date.getFullYear(), date.getMonth() + 1);

    return bill.total > apiToken.workspace.billingQuota.limit;
}

export const getApiTokenUsagePerService = async (apiToken: ApiToken, year: number, month: number): Promise<{
    serviceId: number,
    durationInMs: number
}[]> => {
    const from = new Date(`${year}-${month}-01`);
    const to = addMonths(from, 1);
    return (await ServiceUsage.getRepository()
        .query('SELECT service_id, SUM(duration_in_ms) AS duration FROM `service_usages` WHERE api_token_id = ? AND usage_started_at >= ? AND usage_started_at < ? GROUP BY service_id', [
            apiToken.id,
            format(from, 'yyyy-MM-dd'),
            format(to, 'yyyy-MM-dd')
        ])).map(({service_id, duration}) => ({
        serviceId: service_id,
        durationInMs: parseInt(duration),
    }));
};
