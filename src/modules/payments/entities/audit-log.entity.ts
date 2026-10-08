import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id_audit' })
  id_audit!: string;

  @Index('idx_audit_logs_user_id')
  @Column({ type: 'uuid', name: 'user_id' })
  user_id!: string;

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
