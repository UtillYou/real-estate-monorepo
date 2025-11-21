import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        name: string;
        avatar: string | undefined;
        role: import("../users/user.entity").UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: number;
            email: string;
            name: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    createAdmin(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        name: string;
        avatar: string | undefined;
        role: import("../users/user.entity").UserRole;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        expires_in: number;
    }>;
    logout(req: Request): Promise<null>;
}
