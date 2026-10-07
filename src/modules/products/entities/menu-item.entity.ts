import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id_menu_item' })
  id: string;

  @Column({ name: 'name_dish', type: 'varchar', length: 100, nullable: false })
  name_dish: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unit_price: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @CreateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  category: Category;

  //@OneToMany(() => Category, (category) => category.menuItems)
  //menuItems: Category[];

  //@JoinColumn({
  //name: 'id_category',
  //referencedColumnName: 'id_category',
  //foreignKeyConstraintName: 'fk_menu_items_categories',
  //})
  //Category!: Category;
}
