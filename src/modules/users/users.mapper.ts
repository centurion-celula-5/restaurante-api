import { UserResponseDto } from './dto/user-response.dto.js';
import { User } from './entities/user.entity.js';

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id_user: user.id_user,
    identification_number: user.identification_number,
    name_user: user.name_user,
    email_user: user.email_user,
    birthday: user.birthday ?? null,
    phone_user: user.phone_user ?? null,
    user_role: user.user_role,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

/** Maps a list of entities (for example the result of `GET /users`). */
export function toUserResponseDtoList(users: User[]): UserResponseDto[] {
  return users.map(toUserResponseDto);
}