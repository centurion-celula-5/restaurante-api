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
import { OrderStatus } from '../enums/order-status.enum.js';
import type { OrderItem } from './order-item.entity.js';

@Entity({ name: 'orders' })
@Unique('UQ_orders_reservation_id', ['reservation_id'])
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id_order' })
  id_order: string;

  // The Table and Reservation entities will be supplied by SPR1-03.
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

  @OneToMany('OrderItem', (orderItem: OrderItem) => orderItem.order)
  order_items: Relation<OrderItem[]>;
}
