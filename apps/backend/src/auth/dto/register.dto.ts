import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: UserRole;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
