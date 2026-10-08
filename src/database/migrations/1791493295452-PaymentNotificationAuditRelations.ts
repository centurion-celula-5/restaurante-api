import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentNotificationAuditRelations1791493295452 implements MigrationInterface {
  name = 'PaymentNotificationAuditRelations1791493295452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "fk_notifications_users" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD CONSTRAINT "fk_audit_logs_users" FOREIGN KEY ("user_id") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "fk_payments_orders" FOREIGN KEY ("order_id") REFERENCES "orders"("id_order") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "fk_payments_orders"
        `);
    await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP CONSTRAINT "fk_audit_logs_users"
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "fk_notifications_users"
        `);
  }
}
