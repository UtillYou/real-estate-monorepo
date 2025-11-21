import { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    role?: UserRole;
    name: string;
    avatar?: string;
}
