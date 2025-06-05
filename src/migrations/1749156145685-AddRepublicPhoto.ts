import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRepublicPhoto1749156145685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "republics" 
            ADD COLUMN "linkFoto" varchar
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "republics" 
            DROP COLUMN "linkFoto"
        `);
    }

}
