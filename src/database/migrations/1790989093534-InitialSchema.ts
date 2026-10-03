import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1790989093534 implements MigrationInterface {
    name = 'InitialSchema1790989093534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."inventory_unit" AS ENUM('GR', 'ML', 'UN')
        `);
        await queryRunner.query(`
            CREATE TABLE "inventory_items" (
                "id_inventory_items" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code_product" character varying(50) NOT NULL,
                "name_product" character varying(100) NOT NULL,
                "unit_base" "public"."inventory_unit" NOT NULL,
                "current_stock" numeric(12, 3) NOT NULL DEFAULT '0',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_5e7ba8cc7f0be50826c9de7b8f4" UNIQUE ("code_product"),
                CONSTRAINT "UQ_10031ad5ffb6a80b10670925fbc" UNIQUE ("name_product"),
                CONSTRAINT "UQ_33395ce5b698d4bb6ad8a7b874e" UNIQUE ("code_product", "name_product"),
                CONSTRAINT "PK_1afc62e44f359ae4c55634eb36f" PRIMARY KEY ("id_inventory_items")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_user_role_enum" AS ENUM('ADMIN', 'WAITER')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id_user" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "identification_number" character varying(50) NOT NULL,
                "name_user" character varying(150) NOT NULL,
                "email_user" character varying(150) NOT NULL,
                "password_hash" character varying(355) NOT NULL,
                "birthday" date,
                "phone_user" character varying(50),
                "user_role" "public"."users_user_role_enum" NOT NULL DEFAULT 'WAITER',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_bad68fff2dd56b25a1f4c15006c" UNIQUE ("identification_number"),
                CONSTRAINT "UQ_6a96700476ddd642b04e29c85f5" UNIQUE ("email_user"),
                CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY ("id_user")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_user_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "inventory_items"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."inventory_unit"
        `);
    }

}
