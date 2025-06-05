import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFaculdadeEnum1749157000000 implements MigrationInterface {
    name = 'UpdateFaculdadeEnum1749157000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, alteramos a coluna para text para remover a restrição do enum
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "faculdade" TYPE text`);
        
        // Atualizamos os valores existentes
        await queryRunner.query(`UPDATE "users" SET "faculdade" = 'ufop' WHERE "faculdade" = 'UFOP'`);
        await queryRunner.query(`UPDATE "users" SET "faculdade" = 'uemg' WHERE "faculdade" = 'UEMG'`);
        
        // Removemos o enum antigo
        await queryRunner.query(`DROP TYPE IF EXISTS "users_faculdade_enum"`);
        
        // Criamos o novo enum
        await queryRunner.query(`CREATE TYPE "users_faculdade_enum" AS ENUM('ufop', 'uemg')`);
        
        // Aplicamos o novo enum à coluna
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "faculdade" TYPE "users_faculdade_enum" USING "faculdade"::"users_faculdade_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Alteramos a coluna para text
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "faculdade" TYPE text`);
        
        // Atualizamos os valores de volta
        await queryRunner.query(`UPDATE "users" SET "faculdade" = 'UFOP' WHERE "faculdade" = 'ufop'`);
        await queryRunner.query(`UPDATE "users" SET "faculdade" = 'UEMG' WHERE "faculdade" = 'uemg'`);
        
        // Removemos o enum novo
        await queryRunner.query(`DROP TYPE IF EXISTS "users_faculdade_enum"`);
        
        // Criamos o enum antigo
        await queryRunner.query(`CREATE TYPE "users_faculdade_enum" AS ENUM('UFOP', 'UEMG')`);
        
        // Aplicamos o enum antigo à coluna
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "faculdade" TYPE "users_faculdade_enum" USING "faculdade"::"users_faculdade_enum"`);
    }
} 