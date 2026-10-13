import {
  Column,
  Check,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { Reservation } from '../../reservations/entities/reservation.entity.js';
import { TableStatus, TableZone } from '../enums/table-zone.enum.js';

@Entity({ name: 'tables' })
@Check('CHK_tables_capacity_positive', '"capacity" > 0')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid', { name: 'id_table' })
  id_table: string;

  @Column({ name: 'table_number', type: 'varchar', length: 50, unique: true })
  table_number: string;

  @Column({ name: 'capacity', type: 'smallint' })
  capacity: number;

  @Column({
    name: 'zone',
    type: 'enum',
    enum: TableZone,
    enumName: 'table_zone',
  })
  zone: TableZone;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TableStatus,
    enumName: 'table_status',
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  // LADO 1: Mesa (Tiene MUCHAS reservas) -> PLURAL
  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations?: Relation<Reservation[]>;

  // LADO 1: Mesa (Tiene MUCHAS órdenes) -> PLURAL
  @OneToMany(() => Order, (order) => order.table)
  orders?: Relation<Order[]>;
}
