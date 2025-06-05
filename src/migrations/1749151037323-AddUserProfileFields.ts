import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfileFields1749151037323 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar enum para hierarquia
        await queryRunner.query(`
            CREATE TYPE "user_hierarchy_enum" AS ENUM(
                'calouro', 
                'morador', 
                'decano', 
                'ex-morador'
            )
        `);

        // Criar enum para faculdade
        await queryRunner.query(`
            CREATE TYPE "faculdade_enum" AS ENUM(
                'UFOP', 
                'UEMG'
            )
        `);

        // Adicionar novos campos na tabela users
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "apelido" varchar,
            ADD COLUMN "periodoIngresso" varchar,
            ADD COLUMN "origem" varchar,
            ADD COLUMN "faculdade" "faculdade_enum",
            ADD COLUMN "curso" varchar,
            ADD COLUMN "hierarquia" "user_hierarchy_enum",
            ADD COLUMN "descricao" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover os campos adicionados
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "apelido",
            DROP COLUMN "periodoIngresso",
            DROP COLUMN "origem",
            DROP COLUMN "faculdade",
            DROP COLUMN "curso",
            DROP COLUMN "hierarquia",
            DROP COLUMN "descricao"
        `);

        // Remover os enums
        await queryRunner.query(`DROP TYPE "user_hierarchy_enum"`);
        await queryRunner.query(`DROP TYPE "faculdade_enum"`);
    }

}
