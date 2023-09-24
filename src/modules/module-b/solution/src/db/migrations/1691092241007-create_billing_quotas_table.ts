import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBillingQuotasTable1691092241007 implements MigrationInterface {
    name = 'CreateBillingQuotasTable1691092241007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`billing_quotas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`limit\` decimal(10,2) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD \`billing_quota_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD UNIQUE INDEX \`IDX_bc02d89a5cbb742925cda902c5\` (\`billing_quota_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_bc02d89a5cbb742925cda902c5\` ON \`workspaces\` (\`billing_quota_id\`)`);
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD CONSTRAINT \`FK_bc02d89a5cbb742925cda902c5b\` FOREIGN KEY (\`billing_quota_id\`) REFERENCES \`billing_quotas\`(\`id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_bc02d89a5cbb742925cda902c5b\``);
        await queryRunner.query(`DROP INDEX \`REL_bc02d89a5cbb742925cda902c5\` ON \`workspaces\``);
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP INDEX \`IDX_bc02d89a5cbb742925cda902c5\``);
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP COLUMN \`billing_quota_id\``);
        await queryRunner.query(`DROP TABLE \`billing_quotas\``);
    }

}
