import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TableStatus, TableZone } from '../enums/table-zone.enum.js';
import { timeStamp } from 'node:console';
import { Timestamp } from 'typeorm/driver/mongodb/bson.typings.js';
import { UpdateAuthDto } from '../../auth/dto/update-auth.dto.js';

@Entity({ name: 'restaurant_tables' })
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid', { name: 'id_table' })
  id_table: string;

  @Column({ name: 'table_number', type: 'varchar', length: 50, unique: true })
  table_number: string;

  @Column({ name: 'capacity', type: 'smallint' })
  capacity: number;

  @Column({
    name: 'zone',
    type: 'enum',
    enum: TableZone,
    enumName: 'table_zone',
  })
  zone: TableZone;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TableStatus,
    enumName: 'TableStatus',
    default: TableStatus.AVAILABLE,
  })
  status: TableStatus;

  @CreateDateColumn({ name: 'Created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;
}
