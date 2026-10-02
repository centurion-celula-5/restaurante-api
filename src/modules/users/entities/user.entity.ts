import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum.js';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id_user' })
  id_user: string;

  @Column({ type: 'varchar', length: 50, unique: true , name: 'identification_number' })
  identification_number: string;

  @Column({ type: 'varchar', length: 150, name: 'name_user' })
  name_user: string;

  @Column({ type: 'varchar', length: 150, unique: true, name: 'email_user' })
  email_user: string;

  @Column({ type: 'varchar', length: 355, name: 'password_hash' })
  password_hash: string;

  @Column({ type: 'date', nullable: true, name: 'birthday' })
  birthday: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'phone_user' })
  phone_user: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.WAITER, name: 'user_role' })
  user_role: UserRole;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}