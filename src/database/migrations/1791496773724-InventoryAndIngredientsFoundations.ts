import { MigrationInterface, QueryRunner } from 'typeorm';

export class InventoryAndIngredientsFoundations1791496773724 implements MigrationInterface {
  name = 'InventoryAndIngredientsFoundations1791496773724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'inventory_items',
      'id_inventory_items',
      'id_inventory_item',
    );
    await queryRunner.query(`
            CREATE TYPE "public"."movement_type" AS ENUM('ENTRY', 'CONSUME', 'RETURN', 'ADJUSTMENT')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."movement_source" AS ENUM('ORDER', 'PURCHASE', 'MANUAL', 'SYSTEM')
        `);
    await queryRunner.query(`
            CREATE TABLE "inventory_movements" (
                "id_inventory_movement" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "inventory_item_id" uuid NOT NULL,
                "movement_type" "public"."movement_type" NOT NULL,
                "movement_source" "public"."movement_source" NOT NULL,
                "quantity" numeric(12, 3) NOT NULL,
                "order_item_id" uuid,
                "performed_by_user_id" uuid NOT NULL,
                "reason" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_892c811624cf6494a4413267aa2" PRIMARY KEY ("id_inventory_movement")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_inventory_movements_inventory_item_id" ON "inventory_movements" ("inventory_item_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_inventory_movements_order_item_id" ON "inventory_movements" ("order_item_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_inventory_movements_performed_by_user_id" ON "inventory_movements" ("performed_by_user_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "menu_item_ingredients" (
                "menu_item_id" uuid NOT NULL,
                "inventory_item_id" uuid NOT NULL,
                "quantity_required" numeric(12, 3) NOT NULL,
                CONSTRAINT "PK_2e45988ff0b0125ebdacdc68472" PRIMARY KEY ("menu_item_id", "inventory_item_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_menu_item_ingredients_inventory_item_id" ON "menu_item_ingredients" ("inventory_item_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_items"
            ADD "minimum_stock" numeric(12, 3) NOT NULL DEFAULT 0
        `);
    // Existing items had no threshold; initialize them to zero and keep
    // the final column without a default, as declared in the entity.
    await queryRunner.query(
      'ALTER TABLE "inventory_items" ALTER COLUMN "minimum_stock" DROP DEFAULT',
    );
    await queryRunner.query(`
            ALTER TABLE "inventory_movements"
            ADD CONSTRAINT "fk_inventory_movements_items" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id_inventory_item") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_movements"
            ADD CONSTRAINT "fk_inventory_movements_order_items" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id_order_item") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_movements"
            ADD CONSTRAINT "fk_inventory_movements_users" FOREIGN KEY ("performed_by_user_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_item_ingredients"
            ADD CONSTRAINT "fk_menu_item_ingredients_menu_items" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id_menu_item") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_item_ingredients"
            ADD CONSTRAINT "fk_menu_item_ingredients_inventory_items" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id_inventory_item") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            CREATE FUNCTION "public"."reject_inventory_movement_mutation"()
            RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                RAISE EXCEPTION 'Los movimientos de inventario son inmutables; registre un nuevo movimiento'
                USING ERRCODE = '23514', CONSTRAINT = 'inventory_movements_immutable';
            END;
            $$
        `);
    await queryRunner.query(`
            CREATE TRIGGER "trg_inventory_movements_immutable"
            BEFORE UPDATE OR DELETE ON "inventory_movements"
            FOR EACH ROW EXECUTE FUNCTION "public"."reject_inventory_movement_mutation"()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'LOCK TABLE "inventory_items", "inventory_movements", "menu_item_ingredients" IN ACCESS EXCLUSIVE MODE',
    );
    const [result] = await queryRunner.query(`
            SELECT EXISTS (SELECT 1 FROM "inventory_movements")
                OR EXISTS (SELECT 1 FROM "menu_item_ingredients")
                OR EXISTS (SELECT 1 FROM "inventory_items" WHERE "minimum_stock" <> 0) AS has_data
        `);
    if (result.has_data) {
      throw new Error(
        'La reversión requiere movimientos e ingredientes vacíos y minimum_stock en cero para conservar los datos del nuevo modelo.',
      );
    }
    await queryRunner.query(
      'DROP TRIGGER "trg_inventory_movements_immutable" ON "inventory_movements"',
    );
    await queryRunner.query(
      'DROP FUNCTION "public"."reject_inventory_movement_mutation"()',
    );
    await queryRunner.query(`
            ALTER TABLE "menu_item_ingredients" DROP CONSTRAINT "fk_menu_item_ingredients_inventory_items"
        `);
    await queryRunner.query(`
            ALTER TABLE "menu_item_ingredients" DROP CONSTRAINT "fk_menu_item_ingredients_menu_items"
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_movements" DROP CONSTRAINT "fk_inventory_movements_users"
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_movements" DROP CONSTRAINT "fk_inventory_movements_order_items"
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_movements" DROP CONSTRAINT "fk_inventory_movements_items"
        `);
    await queryRunner.query(`
            ALTER TABLE "inventory_items" DROP COLUMN "minimum_stock"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_menu_item_ingredients_inventory_item_id"
        `);
    await queryRunner.query(`
            DROP TABLE "menu_item_ingredients"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_inventory_movements_performed_by_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_inventory_movements_order_item_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_inventory_movements_inventory_item_id"
        `);
    await queryRunner.query(`
            DROP TABLE "inventory_movements"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."movement_source"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."movement_type"
        `);
    await queryRunner.renameColumn(
      'inventory_items',
      'id_inventory_item',
      'id_inventory_items',
    );
  }
}
