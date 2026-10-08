import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesService } from './tables.service.js';
import { TablesController } from './tables.controller.js';
import { RestaurantTable } from './entities/table.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantTable])],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}
