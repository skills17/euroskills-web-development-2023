import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from '../../entities/User';
import { hash } from '../../utils/hashing';
import { Service } from '../../entities/Service';
import { Workspace } from '../../entities/Workspace';
import { ApiToken } from '../../entities/ApiToken';
import { ServiceUsage } from '../../entities/ServiceUsage';
import { BillingQuota } from '../../entities/BillingQuota';

export class InsertSampleData1691315514778 implements MigrationInterface {
    name = 'InsertSampleData1691315514778'

    private async generateServiceUsage(service: Service, token: ApiToken, year: number, month: number, usage: number) {
        let usageLeft = usage;
        let steps = Math.ceil(Math.random() * 50);
        let usageSteps = Math.ceil(usage / steps);
        let lastDate = new Date(`${year}-${month}-01`);
        let maxStepSize = (27 * 24 * 60 * 60 * 1000) / steps;

        while (usageLeft > 0) {
            let nextUsage = usageLeft > usageSteps ? (usageSteps - Math.floor(Math.random() * 5)) : usageLeft;
            usageLeft -= nextUsage;
            lastDate = new Date(lastDate.getTime() + Math.ceil(Math.random() * maxStepSize));

            const usage = new ServiceUsage();
            usage.service = service;
            usage.apiToken = token;
            usage.usageStartedAt = lastDate;
            usage.durationInMs = nextUsage;
            await usage.save();
        }
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        const demo1 = new User();
        demo1.username = 'demo1';
        demo1.password = await hash('skills2023d1');
        demo1.createdAt = new Date('2023-06-27 14:32:11');
        demo1.updatedAt = demo1.createdAt;
        await demo1.save();

        const demo2 = new User();
        demo2.username = 'demo2';
        demo2.password = await hash('skills2023d2');
        demo2.createdAt = new Date('2023-06-27 14:33:11');
        demo2.updatedAt = demo2.createdAt;
        await demo2.save();

        const service1 = new Service();
        service1.name = 'ChatterBlast';
        service1.costPerMs = 0.0015;
        service1.createdAt = new Date('2023-06-26 10:00:00');
        service1.updatedAt = service1.createdAt;
        await service1.save();

        const service2 = new Service();
        service2.name = 'DreamWeaver';
        service2.costPerMs = 0.005;
        service2.createdAt = new Date('2023-06-26 11:00:00');
        service2.updatedAt = service2.createdAt;
        await service2.save();

        const service3 = new Service();
        service3.name = 'MindReader';
        service3.costPerMs = 0.01;
        service3.createdAt = new Date('2023-06-26 12:00:00');
        service3.updatedAt = service3.createdAt;
        await service3.save();

        const workspace1 = new Workspace();
        workspace1.title = 'My App';
        workspace1.user = demo1;
        workspace1.createdAt = new Date('2023-06-28 12:55:05');
        workspace1.updatedAt = workspace1.createdAt;
        await workspace1.save();

        const workspace2 = new Workspace();
        workspace2.title = 'Default Workspace';
        workspace2.description = 'My personal workspace for smaller apps.';
        workspace2.user = demo2;
        workspace2.createdAt = new Date('2023-06-28 16:06:34');
        workspace2.updatedAt = workspace2.createdAt;
        await workspace2.save();

        const workspace3 = new Workspace();
        workspace3.title = 'Quota Exceeded Test';
        workspace3.user = demo1;
        workspace3.createdAt = new Date('2023-06-28 12:55:05');
        workspace3.updatedAt = workspace3.createdAt;
        await workspace3.save();

        const devToken = new ApiToken();
        devToken.name = 'development';
        devToken.token = '13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6';
        devToken.workspace = workspace1;
        devToken.createdAt = new Date('2023-06-28 13:14:22');
        devToken.updatedAt = devToken.createdAt;
        await devToken.save();

        const prodToken = new ApiToken();
        prodToken.name = 'production';
        prodToken.token = '8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91';
        prodToken.workspace = workspace1;
        prodToken.createdAt = new Date('2023-06-28 18:44:51');
        prodToken.updatedAt = prodToken.createdAt;
        await prodToken.save();

        const testToken = new ApiToken();
        testToken.name = 'test';
        testToken.token = 'b8ef2feea8a2bf982d637b5ff4be4771d2ef46f3564c5ecd7b';
        testToken.workspace = workspace3;
        testToken.createdAt = new Date('2023-06-28 18:44:51');
        testToken.updatedAt = testToken.createdAt;
        await testToken.save();

        const billingQuota = new BillingQuota();
        billingQuota.limit = 9;
        billingQuota.workspace = workspace3;
        billingQuota.createdAt = new Date('2023-06-28 12:57:05');
        billingQuota.updatedAt = billingQuota.createdAt;
        await billingQuota.save();

        await this.generateServiceUsage(service1, prodToken, 2023, 7, 1502);
        await this.generateServiceUsage(service2, prodToken, 2023, 7, 705);
        await this.generateServiceUsage(service1, devToken, 2023, 7, 406);
        await this.generateServiceUsage(service1, prodToken, 2023, 8, 1039);
        await this.generateServiceUsage(service2, prodToken, 2023, 8, 501);
        await this.generateServiceUsage(service1, devToken, 2023, 8, 162);
        await this.generateServiceUsage(service1, prodToken, 2023, 9, 1500);
        await this.generateServiceUsage(service2, prodToken, 2023, 9, 800);
        await this.generateServiceUsage(service1, devToken, 2023, 9, 500);
        await this.generateServiceUsage(service1, testToken, 2023, 9, 1800);
        await this.generateServiceUsage(service2, testToken, 2023, 9, 900);
        await this.generateServiceUsage(service3, testToken, 2023, 9, 200);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('TRUNCATE TABLE api_tokens');
        await queryRunner.query('TRUNCATE TABLE billing_quotas');
        await queryRunner.query('TRUNCATE TABLE service_usages');
        await queryRunner.query('TRUNCATE TABLE services');
        await queryRunner.query('TRUNCATE TABLE workspaces');
        await queryRunner.query('TRUNCATE TABLE users');
    }

}
