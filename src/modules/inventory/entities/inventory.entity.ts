import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UnitBase } from "../enums/unit-base.enum.js";

@Entity({ name: 'inventory_items'})
@Unique(['code_product', 'name_product'])
export class InventoryItems {
    @PrimaryGeneratedColumn('uuid', {name: 'id_inventory_items'})
    id_inventory_items: string;

    @Column({unique: true, name: 'code_product', type: 'varchar', length: 50})
    code_product: string;

    @Column({unique: true, name: 'name_product', type: 'varchar', length: 100})
    name_product: string;

    @Column({name: 'unit_base', type: 'enum', enum: UnitBase, enumName: 'inventory_unit'})
    unit_base: string;

    @Column({name: 'current_stock', type: 'numeric', scale: 3, default: 0})
    current_stock: number;

    @Column({name: 'is_active', type: 'boolean', default: true})
    is_active: true

    @CreateDateColumn({name: 'created_at', type: 'timestamptz'})
    created_at: Date;

    @CreateDateColumn({name: 'updated_at', type: 'timestamptz'})
    updated_at: Date;

}
