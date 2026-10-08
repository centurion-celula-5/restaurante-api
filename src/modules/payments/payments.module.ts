import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { Payment } from './entities/payment.entity.js';
import { AuditLog } from './entities/audit-log.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, AuditLog])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
