import { IsIn } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserRoleDto {
  @IsIn(['admin', 'user'])
  role: UserRole;
}
