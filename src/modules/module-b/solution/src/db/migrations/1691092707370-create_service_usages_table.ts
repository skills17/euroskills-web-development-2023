import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceUsagesTable1691092707370 implements MigrationInterface {
    name = 'CreateServiceUsagesTable1691092707370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_usages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`duration_in_ms\` int NOT NULL, \`api_token_id\` int NOT NULL, \`service_id\` int NOT NULL, \`usage_started_at\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_usages\` ADD CONSTRAINT \`FK_5ccd2747635edaf9f36f8bae5de\` FOREIGN KEY (\`api_token_id\`) REFERENCES \`api_tokens\`(\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`service_usages\` ADD CONSTRAINT \`FK_edbd8912f285c2a423d66020061\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_usages\` DROP FOREIGN KEY \`FK_edbd8912f285c2a423d66020061\``);
        await queryRunner.query(`ALTER TABLE \`service_usages\` DROP FOREIGN KEY \`FK_5ccd2747635edaf9f36f8bae5de\``);
        await queryRunner.query(`DROP TABLE \`service_usages\``);
    }

}
