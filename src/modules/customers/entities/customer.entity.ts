import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity.js';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid', { name: 'id_customer' })
  id_customer: string;

  @Column({ name: 'name_customer', type: 'varchar', length: 150 })
  name_customer: string;

  @Column({ name: 'phone_customer', type: 'varchar', length: 30 })
  phone_customer: string;

  @Column({ name: 'email_customer', type: 'varchar', length: 150 })
  email_customer: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

  // LADO 1: Cliente (Tiene MUCHAS reservas) -> PLURAL
  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations?: Relation<Reservation[]>;
}

/*Guia para la elaboración de la entidad de cliente (Customer)

/*@Entity({name: 'customers'})
export class Customer {
@PrimaryGeneratedColumn('uuid', {name: 'id_customer'})
id_customer: string;

@Column({name: 'name_customer', type: 'varchar', length: 150})
name_customer: string;

@Column({name: 'phone_customer', type: 'varchar', length: 38})
phone_customer: number;

@Column({ name: 'email_customer', type: 'varchar', length: 150})
email_customer: string;

@CreateDateColumn({name:'created_at', type: 'timestamptz'})
created_at: Date;

@CreateDateColumn({name:'updated_at', type: 'timestamptz'})
updated_at: Date;

}*/
