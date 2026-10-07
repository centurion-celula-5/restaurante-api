import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryStatus } from '../enums/category-status.enum.js';
import { MenuItem } from '../../products/entities/menu-item.entity.js';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid', { name: 'id_category' })
  id_category: string;

  @Column({
    name: 'name_category',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name_category: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CategoryStatus,
    enumName: 'category_status',
    default: CategoryStatus.ACTIVE,
  })
  status: string;

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

  //@OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  //menuItems: MenuItem[];
}
