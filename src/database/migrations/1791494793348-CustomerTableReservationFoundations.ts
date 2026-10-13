import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerTableReservationFoundations1791494793348 implements MigrationInterface {
  name = 'CustomerTableReservationFoundations1791494793348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "btree_gist"');
    await queryRunner.query(`
            CREATE TABLE "customers" (
                "id_customer" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name_customer" character varying(150) NOT NULL,
                "phone_customer" character varying(30) NOT NULL,
                "email_customer" character varying(150) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5bb1d14d487c9a2f298ed76a3f9" PRIMARY KEY ("id_customer")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."table_zone" AS ENUM('PLANTA1', 'PLANTA2')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."table_status" AS ENUM('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE')
        `);
    await queryRunner.query(`
            CREATE TABLE "tables" (
                "id_table" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "table_number" character varying(50) NOT NULL,
                "capacity" smallint NOT NULL,
                "zone" "public"."table_zone" NOT NULL,
                "status" "public"."table_status" NOT NULL DEFAULT 'AVAILABLE',
                CONSTRAINT "UQ_334ee7fca06f1fe624c1ebfd34f" UNIQUE ("table_number"),
                CONSTRAINT "CHK_tables_capacity_positive" CHECK ("capacity" > 0),
                CONSTRAINT "PK_37bdb17fa67bd6dd2d3f27db98c" PRIMARY KEY ("id_table")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."reservation_status" AS ENUM(
                'CONFIRMED',
                'PENDING',
                'CHECKED_IN',
                'CANCELLED',
                'NO_SHOW',
                'COMPLETED'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "reservations" (
                "id_reservation" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "customer_id" uuid NOT NULL,
                "table_id" uuid NOT NULL,
                "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "guest_count" smallint NOT NULL,
                "status" "public"."reservation_status" NOT NULL DEFAULT 'PENDING',
                "notes" text,
                "cancelled_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "CHK_reservations_guest_count_positive" CHECK ("guest_count" > 0),
                CONSTRAINT "CHK_reservations_interval" CHECK ("ends_at" > "starts_at"),
                CONSTRAINT "EX_reservations_blocking_interval" EXCLUDE USING gist (
                    "table_id" WITH =,
                    tstzrange("starts_at", "ends_at", '[)') WITH &&
                )
                WHERE (
                        "status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                    ),
                    CONSTRAINT "PK_3bf6253a6ec3170ba578b92e9b3" PRIMARY KEY ("id_reservation")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_reservations_customer_id" ON "reservations" ("customer_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_reservations_table_id" ON "reservations" ("table_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "fk_reservations_customers" FOREIGN KEY ("customer_id") REFERENCES "customers"("id_customer") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "reservations"
            ADD CONSTRAINT "fk_reservations_tables" FOREIGN KEY ("table_id") REFERENCES "tables"("id_table") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "fk_orders_tables" FOREIGN KEY ("table_id") REFERENCES "tables"("id_table") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "fk_orders_reservations" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id_reservation") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_reservations_interval" ON "reservations"
            USING gist (tstzrange("starts_at", "ends_at", '[)'))
        `);
    await queryRunner.query(`
            CREATE FUNCTION "public"."check_reservation_capacity"()
            RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE allowed_capacity smallint;
            BEGIN
                SELECT capacity INTO allowed_capacity FROM "tables"
                WHERE id_table = NEW.table_id FOR SHARE;
                IF FOUND AND NEW.guest_count > allowed_capacity THEN
                    RAISE EXCEPTION 'guest_count supera la capacidad de la mesa'
                    USING ERRCODE = '23514', CONSTRAINT = 'CHK_reservations_capacity';
                END IF;
                RETURN NEW;
            END;
            $$
        `);
    await queryRunner.query(`
            CREATE TRIGGER "trg_reservations_capacity"
            BEFORE INSERT OR UPDATE OF "table_id", "guest_count" ON "reservations"
            FOR EACH ROW EXECUTE FUNCTION "public"."check_reservation_capacity"()
        `);
    await queryRunner.query(`
            CREATE FUNCTION "public"."check_table_reservation_capacity"()
            RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM "reservations"
                    WHERE table_id = NEW.id_table AND guest_count > NEW.capacity
                ) THEN
                    RAISE EXCEPTION 'La capacidad no puede ser menor que el aforo de sus reservas'
                    USING ERRCODE = '23514', CONSTRAINT = 'CHK_tables_reservation_capacity';
                END IF;
                RETURN NEW;
            END;
            $$
        `);
    await queryRunner.query(`
            CREATE TRIGGER "trg_tables_reservation_capacity"
            BEFORE UPDATE OF "capacity" ON "tables" FOR EACH ROW
            WHEN (OLD.capacity IS DISTINCT FROM NEW.capacity)
            EXECUTE FUNCTION "public"."check_table_reservation_capacity"()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'LOCK TABLE "customers", "tables", "reservations" IN ACCESS EXCLUSIVE MODE',
    );
    const [result] = await queryRunner.query(`
            SELECT EXISTS (SELECT 1 FROM "customers")
                OR EXISTS (SELECT 1 FROM "tables")
                OR EXISTS (SELECT 1 FROM "reservations") AS has_data
        `);
    if (result.has_data) {
      throw new Error(
        'La reversión requiere customers, tables y reservations vacías para no eliminar registros existentes.',
      );
    }
    await queryRunner.query(
      'DROP TRIGGER "trg_tables_reservation_capacity" ON "tables"',
    );
    await queryRunner.query(
      'DROP TRIGGER "trg_reservations_capacity" ON "reservations"',
    );
    await queryRunner.query(
      'DROP FUNCTION "public"."check_table_reservation_capacity"()',
    );
    await queryRunner.query(
      'DROP FUNCTION "public"."check_reservation_capacity"()',
    );
    await queryRunner.query('DROP INDEX "public"."IDX_reservations_interval"');
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_reservations"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_tables"
        `);
    await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "fk_reservations_tables"
        `);
    await queryRunner.query(`
            ALTER TABLE "reservations" DROP CONSTRAINT "fk_reservations_customers"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_reservations_table_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_reservations_customer_id"
        `);
    await queryRunner.query(`
            DROP TABLE "reservations"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."reservation_status"
        `);
    await queryRunner.query(`
            DROP TABLE "tables"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."table_status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."table_zone"
        `);
    await queryRunner.query(`
            DROP TABLE "customers"
        `);
  }
}
