import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from '../../entities/User';
import { hash } from '../../utils/hashing';
import { Service } from '../../entities/Service';
import { Workspace } from '../../entities/Workspace';
import { ApiToken } from '../../entities/ApiToken';
import { ServiceUsage } from '../../entities/ServiceUsage';

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
        await demo1.save();

        const demo2 = new User();
        demo2.username = 'demo2';
        demo2.password = await hash('skills2023d2');
        await demo2.save();

        const service1 = new Service();
        service1.name = 'Service #1';
        service1.costPerMs = 0.0015;
        await service1.save();

        const service2 = new Service();
        service2.name = 'Service #2';
        service2.costPerMs = 0.005;
        await service2.save();

        const service3 = new Service();
        service3.name = 'Service #3';
        service3.costPerMs = 0.01;
        await service3.save();

        const workspace1 = new Workspace();
        workspace1.title = 'My App';
        workspace1.user = demo1;
        await workspace1.save();

        const workspace2 = new Workspace();
        workspace2.title = 'Default Workspace';
        workspace2.description = 'My personal workspace for smaller apps.';
        workspace2.user = demo2;
        await workspace2.save();

        const devToken = new ApiToken();
        devToken.name = 'development';
        devToken.token = '13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6';
        devToken.workspace = workspace1;
        await devToken.save();

        const prodToken = new ApiToken();
        prodToken.name = 'production';
        prodToken.token = '8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91';
        prodToken.workspace = workspace1;
        await prodToken.save();

        await this.generateServiceUsage(service1, prodToken, 2023, 8, 1039);
        await this.generateServiceUsage(service2, prodToken, 2023, 8, 501);
        await this.generateServiceUsage(service1, devToken, 2023, 8, 162);
        await this.generateServiceUsage(service1, prodToken, 2023, 7, 1502);
        await this.generateServiceUsage(service2, prodToken, 2023, 7, 705);
        await this.generateServiceUsage(service1, devToken, 2023, 7, 406);
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
