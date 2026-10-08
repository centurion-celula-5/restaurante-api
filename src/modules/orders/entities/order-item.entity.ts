import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { MenuItem } from '../../products/entities/menu-item.entity.js';
import { OrderItemStatus } from '../enums/order-item-status.enum.js';
import { Order } from './order.entity.js';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id_order_item' })
  id_order_item: string;

  @Index('IDX_order_items_order_id')
  @Column('uuid', { name: 'order_id' })
  order_id: string;

  @Index('IDX_order_items_menu_item_id')
  @Column('uuid', { name: 'menu_item_id' })
  menu_item_id: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unit_price: number;

  @Column({
    name: 'subtotal',
    type: 'numeric',
    precision: 12,
    scale: 2,
    generatedType: 'STORED',
    asExpression: 'quantity * unit_price',
    insert: false,
    update: false,
  })
  subtotal: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderItemStatus,
    enumName: 'order_item_status',
    default: OrderItemStatus.PENDING,
  })
  status: OrderItemStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Order, (order) => order.order_items, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id_order',
    foreignKeyConstraintName: 'fk_order_items_orders',
  })
  order: Relation<Order>;

  @ManyToOne(() => MenuItem, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'menu_item_id',
    referencedColumnName: 'id_menu_item',
    foreignKeyConstraintName: 'fk_order_items_menu_items',
  })
  menu_item: Relation<MenuItem>;
}
