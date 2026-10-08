import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { NotificationType } from '../enums/notification-type.enum.js';

@Entity({ name: 'notifications' })
@Index('idx_notifications_recipient_is_read', ['recipient_user_id', 'is_read'])
export class Notification {
  @PrimaryGeneratedColumn('uuid', { name: 'id_notification' })
  id_notification!: string;

  @Column({ type: 'uuid', name: 'recipient_user_id' })
  recipient_user_id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'recipient_user_id',
    referencedColumnName: 'id_user',
    foreignKeyConstraintName: 'fk_notifications_users',
  })
  recipient_user?: Relation<User>;

  @Column({ type: 'varchar', length: 150, name: 'title' })
  title!: string;

  @Column({ type: 'text', name: 'message' })
  message!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    enumName: 'notification_type',
    default: NotificationType.SYSTEM,
    name: 'type',
  })
  type!: NotificationType;

  @Column({ type: 'boolean', default: false, name: 'is_read' })
  is_read!: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at!: Date;
}
