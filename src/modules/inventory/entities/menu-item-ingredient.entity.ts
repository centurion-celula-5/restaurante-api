import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { MenuItem } from '../../products/entities/menu-item.entity.js';
import { InventoryItems } from './inventory-item.entity.js';

@Entity({ name: 'menu_item_ingredients' })
export class MenuItemIngredient {
  @PrimaryColumn('uuid', { name: 'menu_item_id' })
  menu_item_id: string;

  @Index('IDX_menu_item_ingredients_inventory_item_id')
  @PrimaryColumn('uuid', { name: 'inventory_item_id' })
  inventory_item_id: string;

  @Column({
    name: 'quantity_required',
    type: 'numeric',
    precision: 12,
    scale: 3,
  })
  quantity_required: number;

  @ManyToOne(() => MenuItem, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'menu_item_id',
    referencedColumnName: 'id_menu_item',
    foreignKeyConstraintName: 'fk_menu_item_ingredients_menu_items',
  })
  menu_item?: Relation<MenuItem>;

  @ManyToOne(() => InventoryItems, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'inventory_item_id',
    referencedColumnName: 'id_inventory_item',
    foreignKeyConstraintName: 'fk_menu_item_ingredients_inventory_items',
  })
  inventory_item?: Relation<InventoryItems>;
}
