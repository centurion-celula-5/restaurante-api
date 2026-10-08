import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { InventoryController } from './inventory.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItems } from './entities/inventory-item.entity.js';
import { InventoryMovement } from './entities/inventory-movement.entity.js';
import { MenuItemIngredient } from './entities/menu-item-ingredient.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryItems,
      InventoryMovement,
      MenuItemIngredient,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
