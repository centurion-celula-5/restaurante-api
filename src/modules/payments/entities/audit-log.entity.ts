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

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id_audit' })
  id_audit!: string;

  @Index('idx_audit_logs_user_id')
  @Column({ type: 'uuid', name: 'user_id' })
  user_id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id_user',
    foreignKeyConstraintName: 'fk_audit_logs_users',
  })
  user?: Relation<User>;

  @Column({ type: 'varchar', length: 30, name: 'action' })
  action!: string;

  @Column({ type: 'varchar', length: 30, name: 'entity' })
  entity!: string;

  @Column({ type: 'varchar', length: 64, name: 'entity_id' })
  entity_id!: string;

  @Column({ type: 'jsonb', name: 'details' })
  details!: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at!: Date;
}
