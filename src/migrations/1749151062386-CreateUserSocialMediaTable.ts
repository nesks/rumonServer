import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSocialMediaTable1749151062386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_social_medias" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "telefone" varchar,
                "whatsapp" varchar,
                "instagram" varchar,
                "linkedin" varchar,
                "user_id" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_social_medias" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "user_social_medias" 
            ADD CONSTRAINT "FK_user_social_medias_user" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_social_medias"`);
    }

}
