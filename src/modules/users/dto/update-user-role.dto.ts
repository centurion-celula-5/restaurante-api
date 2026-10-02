import { IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum.js';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)// validates that the value is one of the enum values
  user_role: UserRole;
}