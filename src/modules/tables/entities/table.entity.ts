import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Table {}

/*Guia para crear la entidad de mesas (Table)

/*@Entity({ name: 'inventory_items'})
export class Table {
    @PrimaryGeneratedColumn('uuid', {name: 'id_table'})
    id_table: string;

    @Column({ unique: true, name: 'table_number', type: 'varchar', length: 50})
    table_number: number;

    @Column({ name: 'capacity', type: 'smallint' })
    capacity: number;

    @Column({ name: 'zone', type: 'enum', enum: TableZone, enumName: 'table_zone' })
    zone: TableZone;

    @CreateDateColumn({name: 'create_at', type: 'timestamptz'})
    created_at: Date;

    @CreateDateColumn({name: 'update_at', type: 'timestamptz'})
    update_at: Date;
}*/
