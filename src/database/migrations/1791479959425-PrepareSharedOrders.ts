import { MigrationInterface, QueryRunner } from 'typeorm';

// Must run immediately before UserAndOrderFoundations1791479959426.
export class PrepareSharedOrders1791479959425 implements MigrationInterface {
  name = 'PrepareSharedOrders1791479959425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [orderSchema] = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' AND t.typname = 'order_status'
          AND e.enumlabel = 'in_progress'
      ) AS legacy
    `);
    if (!orderSchema.legacy) return;

    await queryRunner.query('LOCK TABLE "orders" IN ACCESS EXCLUSIVE MODE');
    const [result] = await queryRunner.query(
      'SELECT EXISTS (SELECT 1 FROM "orders") AS has_data',
    );
    if (result.has_data) {
      throw new Error(
        'El esquema antiguo de orders tiene datos. Se requiere una migración de datos antes de integrar SPR1-02; no se eliminaron órdenes.',
      );
    }
    await queryRunner.query('DROP TABLE "orders"');
    await queryRunner.query('DROP TYPE "public"."order_status"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Existing develop databases keep their orders; fresh histories restore
    // Kerin's empty legacy table after SPR1-02 has been reverted.
    if (await queryRunner.hasTable('orders')) return;
    await queryRunner.query(`
      CREATE TYPE "public"."order_status" AS ENUM(
        'pending', 'in_progress', 'completed', 'cancelled'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id_order" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "table_id" uuid NOT NULL,
        "reservation_id" uuid NOT NULL,
        "created_by_user_id" uuid NOT NULL,
        "status" "public"."order_status" NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cedeac4ffe8ca857395059cf954" PRIMARY KEY ("id_order")
      )
    `);
  }
}
