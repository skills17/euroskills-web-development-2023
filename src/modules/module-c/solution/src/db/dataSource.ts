import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Workspace } from '../entities/Workspace';
import { LaravelNamingStrategy } from './namingStrategy';
import { ApiToken } from '../entities/ApiToken';
import { BillingQuota } from '../entities/BillingQuota';
import { Service } from '../entities/Service';
import { ServiceUsage } from '../entities/ServiceUsage';
import { CreateUsersTable1691091534692 } from './migrations/1691091534692-create_users_table';
import { CreateWorkspacesTable1691091567274 } from './migrations/1691091567274-create_workspaces_table';
import { CreateApiTokensTable1691091830668 } from './migrations/1691091830668-create_api_tokens_table';
import { CreateBillingQuotasTable1691092241007 } from './migrations/1691092241007-create_billing_quotas_table';
import { CreateServicesTable1691092484427 } from './migrations/1691092484427-create_services_table';
import { CreateServiceUsagesTable1691092707370 } from './migrations/1691092707370-create_service_usages_table';
import { InsertSampleData1691315514778 } from './migrations/1691315514778-insert_sample_data';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER || 'skill17',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'euroskills2023',
  namingStrategy: new LaravelNamingStrategy(),
  logging: false,
  entities: [
    User,
    Workspace,
    ApiToken,
    BillingQuota,
    Service,
    ServiceUsage,
  ],
  migrations: [
    CreateUsersTable1691091534692,
    CreateWorkspacesTable1691091567274,
    CreateApiTokensTable1691091830668,
    CreateBillingQuotasTable1691092241007,
    CreateServicesTable1691092484427,
    CreateServiceUsagesTable1691092707370,
    InsertSampleData1691315514778,
  ],
  subscribers: [],
});
