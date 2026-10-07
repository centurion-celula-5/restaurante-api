import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovementType } from '../enums/movement-type.enum.js';
import { MovementSource } from '../enums/movement-source.enum.js';
import { nullable } from 'zod';

@Entity({ name: 'inventory_movements' })
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid', { name: 'id_inventory_movement' })
  id_inventory_movement: string;

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

  @Column('uuid', { name: 'order_item_id', nullable: false })
  order_item_id: string | null;

  @Column('uuid', { name: 'performed_by_user_id' })
  performed_by_user_id: string;

  @Column({ name: 'reason', type: 'text', nullable: false })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;
}
