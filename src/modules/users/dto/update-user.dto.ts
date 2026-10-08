import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'user_role'] as const),
  { skipNullProperties: false },
) {}
