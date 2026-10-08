import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from './enum/reservation-estatus.enum.js';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid', { name: 'id_reservation' })
  id_reservation: string;

  @Column('uuid', { name: 'customer_id' })
  customer_id: string;

  @Column('uuid', { name: 'table_id' })
  table_id: string;

  @Column({ name: 'party_size', type: 'timestamptz' })
  party_size: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ReservationStatus,
    enumName: 'reservation_status',
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  uptated_at: Date;
}

//@ManyToOne(() => Customer)
//@JoinColumn({ name: 'customer_id', referencedColumnName: 'id_customer' })
//customer: Customer;

//@ManyToOne(() => RestaurantTable)
//@JoinColumn({ name: 'table_id', referencedColumnName: 'id_table' })
//table: RestaurantTable;
