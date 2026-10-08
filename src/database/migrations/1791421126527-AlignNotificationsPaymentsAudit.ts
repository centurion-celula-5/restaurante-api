import { MigrationInterface, QueryRunner } from "typeorm";

export class AlignNotificationsPaymentsAudit1791421126527 implements MigrationInterface {
    name = 'AlignNotificationsPaymentsAudit1791421126527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP CONSTRAINT "PK_f8ba9ac02a1150760efbd546dc5"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "id_audit_log"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "entity_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "created_by_user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "notification_type"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."notifications_notification_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "recipient"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "subject"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "transaction_reference"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "id_audit" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD CONSTRAINT "PK_87243274567ff1a248e910e5b8a" PRIMARY KEY ("id_audit")
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "user_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "entity" character varying(30) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "recipient_user_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "title" character varying(150) NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."notification_type" AS ENUM('RESERVATION', 'ORDER', 'INVENTORY', 'SYSTEM')
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "type" "public"."notification_type" NOT NULL DEFAULT 'SYSTEM'
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "paid_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "action"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "action" character varying(30) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "entity_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "entity_id" character varying(64) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "details"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "details" jsonb NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "order_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payments_payment_method_enum"
            RENAME TO "payments_payment_method_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payment_method" AS ENUM('CASH', 'CARD', 'TRANSFER')
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "payment_method" TYPE "public"."payment_method" USING "payment_method"::"text"::"public"."payment_method"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_payment_method_enum_old"
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" ("user_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_notifications_recipient_is_read" ON "notifications" ("recipient_user_id", "is_read")
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_payments_order_id" ON "payments" ("order_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."idx_payments_order_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_notifications_recipient_is_read"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_audit_logs_user_id"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payments_payment_method_enum_old" AS ENUM('CASH', 'CARD', 'TRANSFER')
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum_old" USING "payment_method"::"text"::"public"."payments_payment_method_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payment_method"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payments_payment_method_enum_old"
            RENAME TO "payments_payment_method_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "order_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "details"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "details" text
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "entity_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "entity_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "action"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "action" character varying(50) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "paid_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."notification_type"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "title"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "recipient_user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP CONSTRAINT "PK_87243274567ff1a248e910e5b8a"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "id_audit"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "transaction_reference" character varying(120)
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "status" character varying(50)
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "subject" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "recipient" character varying(255) NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."notifications_notification_type_enum" AS ENUM('EMAIL', 'SMS', 'PUSH', 'WHATSAPP')
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "notification_type" "public"."notifications_notification_type_enum" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "created_by_user_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "entity_name" character varying(120) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "id_audit_log" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD CONSTRAINT "PK_f8ba9ac02a1150760efbd546dc5" PRIMARY KEY ("id_audit_log")
        `);
    }

}
