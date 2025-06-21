import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = '1h';
  private readonly REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existing) throw new BadRequestException('Email already registered');
    const hashed = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashed,
      name: registerDto.name,
      avatar: registerDto.avatar,
      role: registerDto.role || 'user',
    });
    const saved = await this.userRepository.save(user);
    return { id: saved.id, email: saved.email, name: saved.name, avatar: saved.avatar, role: saved.role };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate access token (expires in 1 hour)
    const accessToken = this.generateAccessToken(user);
    
    // Generate refresh token (valid for 7 days)
    const refreshToken = await this.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken.token,
      expires_in: 3600, // 1 hour in seconds
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Find the refresh token in the database
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refresh_token },
      relations: ['user'],
    });

    if (!token || token.isRevoked || new Date() > token.expiresAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(token.user);

    return {
      access_token: accessToken,
      expires_in: 3600, // 1 hour in seconds
    };
  }

  private generateAccessToken(user: User): string {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    return this.jwtService.sign(payload, { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN });
  }

  private async generateRefreshToken(user: User): Promise<RefreshToken> {
    // Revoke any existing refresh tokens for this user
    await this.refreshTokenRepository.update(
      { user: { id: user.id }, isRevoked: false },
      { isRevoked: true }
    );

    // Create new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_IN_DAYS);

    const refreshToken = this.refreshTokenRepository.create({
      token: uuidv4(),
      user,
      expiresAt,
      isRevoked: false,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { isRevoked: true }
    );
  }
}
