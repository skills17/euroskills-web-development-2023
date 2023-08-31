import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiTokensTable1691091830668 implements MigrationInterface {
    name = 'CreateApiTokensTable1691091830668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`api_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`token\` varchar(100) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`revoked_at\` timestamp NULL, \`workspace_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`api_tokens\` ADD CONSTRAINT \`FK_9c644dd21cac1a0e8fca9443373\` FOREIGN KEY (\`workspace_id\`) REFERENCES \`workspaces\`(\`id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_tokens\` DROP FOREIGN KEY \`FK_9c644dd21cac1a0e8fca9443373\``);
        await queryRunner.query(`DROP TABLE \`api_tokens\``);
    }

}
