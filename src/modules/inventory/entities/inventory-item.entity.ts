import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UnitBase } from '../enums/unit-base.enum.js';

@Entity({ name: 'inventory_items' })
@Unique(['code_product', 'name_product'])
export class InventoryItems {
  @PrimaryGeneratedColumn('uuid', { name: 'id_inventory_item' })
  id_inventory_item: string;

  @Column({ unique: true, name: 'code_product', type: 'varchar', length: 50 })
  code_product: string;

  @Column({ unique: true, name: 'name_product', type: 'varchar', length: 100 })
  name_product: string;

  @Column({
    name: 'unit_base',
    type: 'enum',
    enum: UnitBase,
    enumName: 'inventory_unit',
  })
  unit_base: UnitBase;

  @Column({
    name: 'current_stock',
    type: 'numeric',
    precision: 12,
    scale: 3,
    default: 0,
  })
  current_stock: number;

  @Column({ name: 'minimum_stock', type: 'numeric', precision: 12, scale: 3 })
  minimum_stock: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;
}

export { InventoryItems as InventoryItem };
