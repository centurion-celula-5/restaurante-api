import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums/payment-method.enum.js';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid', { name: 'id_payment' })
  id_payment: string;

  @Column({ type: 'uuid', nullable: true, name: 'order_id' })
  order_id: string | null;

  // Deferred: coordinate with the Orders owner before enabling this relation.
  // Add the JoinColumn, ManyToOne, and Order imports before uncommenting.
  // @ManyToOne(() => Order, { nullable: true })
  // @JoinColumn({ name: 'order_id', referencedColumnName: 'id_order' })
  // order?: Order;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'amount' })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
  })
  payment_method: PaymentMethod;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'status' })
  status?: string | null;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    name: 'transaction_reference',
  })
  transaction_reference?: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
