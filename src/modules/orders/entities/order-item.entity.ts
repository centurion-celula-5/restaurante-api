import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import { OrderItemStatus } from '../enums/order-item-status.enum.js';
import { Order } from './order.entity.js';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id_order_item' })
  id_order_item: string;

  @Column('uuid', { name: 'order_id' })
  order_id: string;

  @Column('uuid', { name: 'product_id' })
  product_id: string;

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
  })
  status: OrderItemStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Order, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id_order' })
  order: Order;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id_product' })
  product: Product;
}
