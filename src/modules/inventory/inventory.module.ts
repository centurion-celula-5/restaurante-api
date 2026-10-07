import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { InventoryController } from './inventory.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItems } from './entities/inventory-item.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItems])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
