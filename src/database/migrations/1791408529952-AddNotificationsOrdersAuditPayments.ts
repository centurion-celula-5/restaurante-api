import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationsOrdersAuditPayments1791408529952 implements MigrationInterface {
  name = 'AddNotificationsOrdersAuditPayments1791408529952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id_audit_log" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "entity_name" character varying(120) NOT NULL,
                "entity_id" uuid,
                "action" character varying(50) NOT NULL,
                "details" text,
                "created_by_user_id" uuid,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f8ba9ac02a1150760efbd546dc5" PRIMARY KEY ("id_audit_log")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."notifications_notification_type_enum" AS ENUM('EMAIL', 'SMS', 'PUSH', 'WHATSAPP')
        `);
    await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id_notification" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "notification_type" "public"."notifications_notification_type_enum" NOT NULL,
                "recipient" character varying(255) NOT NULL,
                "subject" character varying(255),
                "message" text NOT NULL,
                "is_read" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_aeb74360cf6bc2b15d19ff1c15e" PRIMARY KEY ("id_notification")
            )
        `);
    // Orders may already be provided by SPR1-02 on an existing develop database.
    if (!(await queryRunner.hasTable('orders'))) {
      await queryRunner.query(`
            CREATE TYPE "public"."order_status" AS ENUM(
                'pending',
                'in_progress',
                'completed',
                'cancelled'
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
    await queryRunner.query(`
            CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('CASH', 'CARD', 'TRANSFER')
        `);
    await queryRunner.query(`
            CREATE TABLE "payments" (
                "id_payment" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "order_id" uuid,
                "amount" numeric(12, 2) NOT NULL,
                "payment_method" "public"."payments_payment_method_enum" NOT NULL,
                "status" character varying(50),
                "transaction_reference" character varying(120),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0299214450e732703afccc2a706" PRIMARY KEY ("id_payment")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "payments"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."payments_payment_method_enum"
        `);
    const [orderSchema] = await queryRunner.query(`
        SELECT EXISTS (
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON t.oid = e.enumtypid
            JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = 'public' AND t.typname = 'order_status'
                AND e.enumlabel = 'in_progress'
        ) AS legacy
    `);
    // Do not remove the orders schema owned by SPR1-02.
    if (orderSchema.legacy) {
      await queryRunner.query(`
            DROP TABLE "orders"
        `);
      await queryRunner.query(`
            DROP TYPE "public"."order_status"
        `);
    }
    await queryRunner.query(`
            DROP TABLE "notifications"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."notifications_notification_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "audit_logs"
        `);
  }
}
