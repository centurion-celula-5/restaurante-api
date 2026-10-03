export class Order {}

/*Guia para la elabroacon de la entidad

/*@Entity({name: 'orders'})
export class Order{
    @PrimaryGeneratedColumn('uuid', { name: 'id_order' })
    id_order: string;

    @Column('uuid', { name: 'table_id' })
    table_id: string;

    @Column('uuid',{ name: 'reservation_id' })
    reservation_id: string;

    @Column('uuid', {name: 'created_by_user_id'})
    created_by_user_id: string;

    @Column({name: 'status', type: 'enum', enum: OrderStatus, enumName: 'order_status' })
    status: OrderStatus; 

    @CreateDateColumn({name: 'created_at', type: 'timestamp'})
    created_at: Date;

    @CreateDateColumn({name: 'updated_at', type: 'timestamp'})
    updated_at: Date;

    @ManyToOne(() => Table, {nullable: false, onDelete: 'RESTRICT'})
    @JoinColumn({ name: 'table_id', referencedColumnName: 'id_table', foreignKeyConstraintName: 'fk_orders_table' })
    table: Table;
    
}   */
