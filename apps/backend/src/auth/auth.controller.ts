import { Controller, Post, Body, BadRequestException, UseGuards, Request as NestRequest } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './roles.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    if (!user) throw new BadRequestException('Registration failed');
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('create-admin')
  @UseGuards(AuthGuard('jwt'))
  @Role('admin')
  async createAdmin(@Body() registerDto: RegisterDto) {
    // Only admin can access; create user with role 'admin'
    return this.authService.register({ ...registerDto, role: 'admin' });
  }
}
