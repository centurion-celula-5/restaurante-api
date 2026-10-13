import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryAndMenuSchema1791418209061 implements MigrationInterface {
  name = 'CategoryAndMenuSchema1791418209061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."category_status" AS ENUM('ACTIVE', 'INACTIVE')
        `);
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id_category" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name_category" character varying(50) NOT NULL,
                "description" text,
                "status" "public"."category_status" NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8ac255b9743120147e61fb5465b" PRIMARY KEY ("id_category")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "menu_items" (
                "id_menu_item" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name_dish" character varying(100) NOT NULL,
                "description" text,
                "unit_price" numeric(12, 2) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e1e5bb7078eea2cb1832a26d41c" PRIMARY KEY ("id_menu_item")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "menu_items"
        `);
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."category_status"
        `);
  }
}
