import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'user_role'] as const), 
) {}
// omits the 'password' and 'user_role' properties from CreateUserDto, and makes the remaining properties optional for updating a user.