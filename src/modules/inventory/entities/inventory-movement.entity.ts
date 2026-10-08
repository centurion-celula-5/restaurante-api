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
import { InventoryItems } from './inventory-item.entity.js';
import { OrderItem } from '../../orders/entities/order-item.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { MovementType } from '../enums/movement-type.enum.js';
import { MovementSource } from '../enums/movement-source.enum.js';

@Entity({ name: 'inventory_movements' })
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid', { name: 'id_inventory_movement' })
  id_inventory_movement: string;

  @Index('IDX_inventory_movements_inventory_item_id')
  @Column('uuid', { name: 'inventory_item_id' })
  inventory_item_id: string;

  @Column({
    name: 'movement_type',
    type: 'enum',
    enum: MovementType,
    enumName: 'movement_type',
  })
  movement_type: MovementType;

  @Column({
    name: 'movement_source',
    type: 'enum',
    enum: MovementSource,
    enumName: 'movement_source',
  })
  movement_source: MovementSource;

  @Column({ name: 'quantity', type: 'numeric', precision: 12, scale: 3 })
  quantity: number;

  @Index('IDX_inventory_movements_order_item_id')
  @Column('uuid', { name: 'order_item_id', nullable: true })
  order_item_id: string | null;

  @Index('IDX_inventory_movements_performed_by_user_id')
  @Column('uuid', { name: 'performed_by_user_id' })
  performed_by_user_id: string;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => InventoryItems, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'inventory_item_id',
    referencedColumnName: 'id_inventory_item',
    foreignKeyConstraintName: 'fk_inventory_movements_items',
  })
  inventory_item?: Relation<InventoryItems>;

  @ManyToOne(() => OrderItem, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'order_item_id',
    referencedColumnName: 'id_order_item',
    foreignKeyConstraintName: 'fk_inventory_movements_order_items',
  })
  order_item?: Relation<OrderItem> | null;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'performed_by_user_id',
    referencedColumnName: 'id_user',
    foreignKeyConstraintName: 'fk_inventory_movements_users',
  })
  performed_by_user?: Relation<User>;
}
