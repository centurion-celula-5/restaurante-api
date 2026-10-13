import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { MenuItem } from '../../products/entities/menu-item.entity.js';
import { InventoryMovement } from '../../inventory/entities/inventory-movement.entity.js';
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

  // LADO N: Detalle de orden (Pertenece a UNA orden) -> SINGULAR
  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id_order',
    foreignKeyConstraintName: 'fk_order_items_orders',
  })
  order: Relation<Order>;

  // LADO N: Detalle de orden (Referencia UN producto del menú) -> SINGULAR
  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'menu_item_id',
    referencedColumnName: 'id_menu_item',
    foreignKeyConstraintName: 'fk_order_items_menu_items',
  })
  menuItem: Relation<MenuItem>;

  // LADO 1: Detalle de orden (Tiene MUCHOS movimientos) -> PLURAL
  @OneToMany(() => InventoryMovement, (movement) => movement.orderItem)
  inventoryMovements?: Relation<InventoryMovement[]>;
}
