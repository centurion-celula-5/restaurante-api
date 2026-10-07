import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../enums/notification-type.enum.js';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid', { name: 'id_notification' })
  id_notification: string;

  @Column({ type: 'enum', enum: NotificationType, name: 'notification_type' })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255, name: 'recipient' })
  recipient: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'subject' })
  subject?: string | null;

  @Column({ type: 'text', name: 'message' })
  message: string;

  @Column({ type: 'boolean', default: false, name: 'is_read' })
  is_read: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
