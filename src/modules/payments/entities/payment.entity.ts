import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { PaymentMethod } from '../enums/payment-method.enum.js';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid', { name: 'id_payment' })
  id_payment!: string;

  @Index('idx_payments_order_id')
  @Column({ type: 'uuid', name: 'order_id' })
  order_id!: string;

  @ManyToOne(() => Order, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id_order',
    foreignKeyConstraintName: 'fk_payments_orders',
  })
  order?: Relation<Order>;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'amount' })
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    enumName: 'payment_method',
    name: 'payment_method',
  })
  payment_method!: PaymentMethod;

  @Column({ type: 'timestamptz', default: () => 'now()', name: 'paid_at' })
  paid_at!: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at!: Date;
}
