import { PartialType } from '@nestjs/swagger';
import { CreateInventoryMovementDto } from './create-inventory-movement.dto.js';

// Sprint 1 payload schema only: recorded movements are immutable and must not
// expose an update endpoint. Corrections create a new movement instead.
export class UpdateInventoryMovementDto extends PartialType(
  CreateInventoryMovementDto,
  {
    skipNullProperties: false,
  },
) {}
