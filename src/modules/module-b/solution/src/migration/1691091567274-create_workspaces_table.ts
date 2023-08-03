import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkspacesTable1691091567274 implements MigrationInterface {
    name = 'CreateWorkspacesTable1691091567274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`workspaces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`description\` text NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`workspaces\` ADD CONSTRAINT \`FK_78512d762073bf8cb3fc88714c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspaces\` DROP FOREIGN KEY \`FK_78512d762073bf8cb3fc88714c1\``);
        await queryRunner.query(`DROP TABLE \`workspaces\``);
    }

}
