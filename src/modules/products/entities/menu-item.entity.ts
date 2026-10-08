import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';
import { MenuItemState } from '../enums/menu-item-state.enum.js';
import { MenuItemAvailability } from '../enums/menu-item-availability.enum.js';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id_menu_item' })
  id_menu_item: string;

  @Column({ name: 'name_dish', type: 'varchar', length: 100, nullable: false })
  name_dish: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unit_price: number;

  @Index('IDX_menu_items_category_id')
  @Column({ name: 'category_id', type: 'integer', nullable: false })
  category_id: number;

  @ManyToOne(() => Category, (category) => category.menuItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id_category',
    foreignKeyConstraintName: 'fk_menu_items_categories',
  })
  category: Relation<Category>;

  @Column({
    name: 'state',
    type: 'enum',
    enum: MenuItemState,
    enumName: 'menu_item_state',
    default: MenuItemState.ACTIVE,
  })
  state: MenuItemState;

  @Column({
    name: 'availability',
    type: 'enum',
    enum: MenuItemAvailability,
    enumName: 'menu_item_availability',
    default: MenuItemAvailability.AVAILABLE,
  })
  availability: MenuItemAvailability;
}
