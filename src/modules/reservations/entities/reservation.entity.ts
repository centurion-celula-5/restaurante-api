import {
  Column,
  Check,
  CreateDateColumn,
  Entity,
  Exclusion,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity.js';
import { RestaurantTable } from '../../tables/entities/table.entity.js';
import { ReservationStatus } from './enum/reservation-estatus.enum.js';

@Entity({ name: 'reservations' })
@Check('CHK_reservations_interval', '"ends_at" > "starts_at"')
@Check('CHK_reservations_guest_count_positive', '"guest_count" > 0')
@Exclusion(
  'EX_reservations_blocking_interval',
  `USING gist ("table_id" WITH =, tstzrange("starts_at", "ends_at", '[)') WITH &&) WHERE ("status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN'))`,
)
@Index('IDX_reservations_interval', { synchronize: false })
export class Reservation {
  @PrimaryGeneratedColumn('uuid', { name: 'id_reservation' })
  id_reservation: string;

  @Index('IDX_reservations_customer_id')
  @Column('uuid', { name: 'customer_id' })
  customer_id: string;

  @Index('IDX_reservations_table_id')
  @Column('uuid', { name: 'table_id' })
  table_id: string;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  starts_at: Date;

  @Column({ name: 'ends_at', type: 'timestamptz' })
  ends_at: Date;

  @Column({ name: 'guest_count', type: 'smallint' })
  guest_count: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ReservationStatus,
    enumName: 'reservation_status',
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelled_at: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Customer, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'customer_id',
    referencedColumnName: 'id_customer',
    foreignKeyConstraintName: 'fk_reservations_customers',
  })
  customer?: Relation<Customer>;

  @ManyToOne(() => RestaurantTable, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'table_id',
    referencedColumnName: 'id_table',
    foreignKeyConstraintName: 'fk_reservations_tables',
  })
  table?: Relation<RestaurantTable>;
}
