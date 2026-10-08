import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { CategoryStatus } from '../enums/category-status.enum.js';
import { MenuItem } from '../../products/entities/menu-item.entity.js';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('identity', {
    name: 'id_category',
    type: 'integer',
  })
  id_category: number;

  @Column({
    name: 'name_category',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name_category: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CategoryStatus,
    enumName: 'category_status',
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: Relation<MenuItem[]>;
}
