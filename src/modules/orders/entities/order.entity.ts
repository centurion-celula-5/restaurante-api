import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/status.enum.js';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id_order' })
  id_order: string;

  @Column({ type: 'uuid', name: 'table_id' })
  table_id: string;

  @Column({ type: 'uuid', name: 'reservation_id' })
  reservation_id: string;

  @Column({ type: 'uuid', name: 'created_by_user_id' })
  created_by_user_id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status',
    name: 'status',
  })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
