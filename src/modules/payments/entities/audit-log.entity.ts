import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id_audit_log' })
  id_audit_log: string;

  @Column({ type: 'varchar', length: 120, name: 'entity_name' })
  entity_name: string;

  @Column({ type: 'uuid', nullable: true, name: 'entity_id' })
  entity_id: string | null;

  @Column({ type: 'varchar', length: 50, name: 'action' })
  action: string;

  @Column({ type: 'text', nullable: true, name: 'details' })
  details?: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'created_by_user_id' })
  created_by_user_id?: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
