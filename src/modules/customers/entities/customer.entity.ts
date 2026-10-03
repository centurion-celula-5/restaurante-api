export class Customer {}

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
