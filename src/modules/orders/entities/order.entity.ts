import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Reservation } from '../../reservations/entities/reservation.entity.js';
import { RestaurantTable } from '../../tables/entities/table.entity.js';
import { OrderStatus } from '../enums/order-status.enum.js';
import type { OrderItem } from './order-item.entity.js';

@Entity({ name: 'orders' })
@Unique('UQ_orders_reservation_id', ['reservation_id'])
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id_order' })
  id_order: string;

  @Index('IDX_orders_table_id')
  @Column('uuid', { name: 'table_id' })
  table_id: string;

  @Column('uuid', { name: 'reservation_id', nullable: true })
  reservation_id: string | null;

  @Index('IDX_orders_created_by_user_id')
  @Column('uuid', { name: 'created_by_user_id' })
  created_by_user_id: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status',
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'created_by_user_id',
    referencedColumnName: 'id_user',
    foreignKeyConstraintName: 'fk_orders_users',
  })
  created_by_user: Relation<User>;

  @ManyToOne(() => RestaurantTable, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'table_id',
    referencedColumnName: 'id_table',
    foreignKeyConstraintName: 'fk_orders_tables',
  })
  table?: Relation<RestaurantTable>;

  // The existing UNIQUE constraint enforces one order per reservation.
  @ManyToOne(() => Reservation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'reservation_id',
    referencedColumnName: 'id_reservation',
    foreignKeyConstraintName: 'fk_orders_reservations',
  })
  reservation?: Relation<Reservation> | null;

  @OneToMany('OrderItem', (orderItem: OrderItem) => orderItem.order)
  order_items: Relation<OrderItem[]>;
}
