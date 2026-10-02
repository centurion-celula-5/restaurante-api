import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema, EnvVariables } from './config/env.schema.js';
import { TablesModule } from './modules/tables/tables.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './database/typeorm.config.js';
import { UsersModule } from './modules/users/users.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { ReservationsModule } from './modules/reservations/reservations.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { InventoryModule } from './modules/inventory/inventory.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envSchema
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariables, true>) => ({
        ...createTypeOrmOptions({
          NODE_ENV: configService.get('NODE_ENV',{infer: true}),
          DB_HOST: configService.get('DB_HOST',{infer: true}),
          DB_PORT: configService.get('DB_PORT',{infer: true}),
          DB_USER: configService.get('DB_USER',{infer: true}),
          DB_PASSWORD: configService.get('DB_PASSWORD',{infer: true}),
          DB_NAME: configService.get('DB_NAME')
        })
      })
    }),
    
    HealthModule,
    TablesModule,
    UsersModule,
    CustomersModule,
    ReservationsModule,
    ProductsModule,
    InventoryModule,
    OrdersModule,
    PaymentsModule,
    AuthModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
