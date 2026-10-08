import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAndOrderFoundations1791479959426 implements MigrationInterface {
  name = 'UserAndOrderFoundations1791479959426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'PREPARATION', 'DELIVERED', 'PAID')
        `);
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id_order" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "table_id" uuid NOT NULL,
                "reservation_id" uuid,
                "created_by_user_id" uuid NOT NULL,
                "status" "public"."order_status" NOT NULL DEFAULT 'PENDING',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_orders_reservation_id" UNIQUE ("reservation_id"),
                CONSTRAINT "PK_cedeac4ffe8ca857395059cf954" PRIMARY KEY ("id_order")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_orders_table_id" ON "orders" ("table_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_orders_created_by_user_id" ON "orders" ("created_by_user_id")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_item_status" AS ENUM(
                'PENDING',
                'PREPARATION',
                'READY',
                'DELIVERED',
                'CANCELLED'
            )
        `);
    await queryRunner.query(
      `
            INSERT INTO "typeorm_metadata"(
                    "database",
                    "schema",
                    "table",
                    "type",
                    "name",
                    "value"
                )
            VALUES (current_database(), $1, $2, $3, $4, $5)
        `,
      [
        'public',
        'order_items',
        'GENERATED_COLUMN',
        'subtotal',
        'quantity * unit_price',
      ],
    );
    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id_order_item" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "order_id" uuid NOT NULL,
                "menu_item_id" uuid NOT NULL,
                "quantity" integer NOT NULL,
                "unit_price" numeric(12, 2) NOT NULL,
                "subtotal" numeric(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED NOT NULL,
                "status" "public"."order_item_status" NOT NULL DEFAULT 'PENDING',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3ba9feb6631b553ef1e2ea77d23" PRIMARY KEY ("id_order_item")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_order_items_order_id" ON "order_items" ("order_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_order_items_menu_item_id" ON "order_items" ("menu_item_id")
        `);
    // Renaming preserves existing users and updates the column default too.
    await queryRunner.query(`
            ALTER TYPE "public"."users_user_role_enum"
            RENAME VALUE 'WAITER' TO 'EMPLOYEE'
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "fk_orders_users" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "fk_order_items_orders" FOREIGN KEY ("order_id") REFERENCES "orders"("id_order") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "fk_order_items_menu_items" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id_menu_item") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "fk_order_items_menu_items"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "fk_order_items_orders"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_users"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."users_user_role_enum"
            RENAME VALUE 'EMPLOYEE' TO 'WAITER'
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_order_items_menu_item_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_order_items_order_id"
        `);
    await queryRunner.query(`
            DROP TABLE "order_items"
        `);
    await queryRunner.query(
      `
            DELETE FROM "typeorm_metadata"
            WHERE "type" = $1
                AND "name" = $2
                AND "database" = current_database()
                AND "schema" = $3
                AND "table" = $4
        `,
      ['GENERATED_COLUMN', 'subtotal', 'public', 'order_items'],
    );
    await queryRunner.query(`
            DROP TYPE "public"."order_item_status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_orders_created_by_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_orders_table_id"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_status"
        `);
  }
}
