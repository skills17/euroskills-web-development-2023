import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from '../../entities/User';
import { hash } from '../../utils/hashing';
import { getUser } from '../../services/user';

export class InsertSampleData1691315514778 implements MigrationInterface {
    name = 'InsertSampleData1691315514778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const demo1 = new User();
        demo1.username = 'demo1';
        demo1.password = await hash('skills2023d1');
        await demo1.save();

        const demo2 = new User();
        demo2.username = 'demo2';
        demo2.password = await hash('skills2023d2');
        await demo2.save();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const demo1 = await getUser('demo1');
        if (demo1) {
            await demo1.remove();
        }

        const demo2 = await getUser('demo2');
        if (demo2) {
            await demo2.remove();
        }
    }

}
