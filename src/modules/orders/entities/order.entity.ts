import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity.js';
import { Table } from '../../tables/entities/table.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { OrderStatus } from '../enums/order-status.enum.js';
import type { OrderItem } from './order-item.entity.js';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id_order' })
  id_order: string;

  @Column('uuid', { name: 'table_id' })
  table_id: string;

  @Column('uuid', { name: 'reservation_id', nullable: true })
  reservation_id: string | null;

  @Column('uuid', { name: 'created_by_user_id' })
  created_by_user_id: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status',
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  //@ManyToOne(() => Table, { nullable: false, onDelete: 'RESTRICT' })
  //@JoinColumn({ name: 'table_id', referencedColumnName: 'id_table' })
 // table: Table;

  //@ManyToOne(() => Reservation, { nullable: true, onDelete: 'SET NULL' })
  //@JoinColumn({
  //  name: 'reservation_id',
  //  referencedColumnName: 'id_reservation',
  //})
  //reservation: Reservation | null;

  //@ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  //@JoinColumn({
 //   name: 'created_by_user_id',
 //   referencedColumnName: 'id_user',
  //})
  //created_by_user: User;

  //@OneToMany('OrderItem', (orderItem: OrderItem) => orderItem.order)
  //order_items: OrderItem[];
}
