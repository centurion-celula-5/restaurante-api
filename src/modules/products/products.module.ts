import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { MenuItem } from './entities/menu-item.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
