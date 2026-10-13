import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderReservationOneToOne1791922757667 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // OneToOne usa este nombre para la restricción UNIQUE que ya existe.
    await queryRunner.query(
      'ALTER TABLE "orders" RENAME CONSTRAINT "UQ_orders_reservation_id" TO "REL_45bdd131d3c34179a7b0f37d15"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "orders" RENAME CONSTRAINT "REL_45bdd131d3c34179a7b0f37d15" TO "UQ_orders_reservation_id"',
    );
  }
}
