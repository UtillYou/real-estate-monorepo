import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtService;
    private readonly ACCESS_TOKEN_EXPIRES_IN;
    private readonly REFRESH_TOKEN_EXPIRES_IN_DAYS;
    constructor(userRepository: Repository<User>, refreshTokenRepository: Repository<RefreshToken>, jwtService: JwtService);
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
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        expires_in: number;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
    revokeRefreshToken(token: string): Promise<void>;
}
