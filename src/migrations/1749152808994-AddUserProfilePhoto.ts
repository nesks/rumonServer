import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfilePhoto1749152808994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "linkfotoPerfil" varchar
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "linkfotoPerfil"
        `);
    }

}
