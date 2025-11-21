"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/user.entity");
const uuid_1 = require("uuid");
const refresh_token_entity_1 = require("./refresh-token.entity");
let AuthService = class AuthService {
    userRepository;
    refreshTokenRepository;
    jwtService;
    ACCESS_TOKEN_EXPIRES_IN = '1h';
    REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;
    constructor(userRepository, refreshTokenRepository, jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existing = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
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
    async login(loginDto) {
        const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return {
            access_token: accessToken,
            refresh_token: refreshToken.token,
            expires_in: 3600,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
    async refreshToken(refreshTokenDto) {
        const token = await this.refreshTokenRepository.findOne({
            where: { token: refreshTokenDto.refresh_token },
            relations: ['user'],
        });
        if (!token || token.isRevoked || new Date() > token.expiresAt) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const accessToken = this.generateAccessToken(token.user);
        return {
            access_token: accessToken,
            expires_in: 3600,
        };
    }
    generateAccessToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return this.jwtService.sign(payload, { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN });
    }
    async generateRefreshToken(user) {
        await this.refreshTokenRepository.update({ user: { id: user.id }, isRevoked: false }, { isRevoked: true });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_IN_DAYS);
        const refreshToken = this.refreshTokenRepository.create({
            token: (0, uuid_1.v4)(),
            user,
            expiresAt,
            isRevoked: false,
        });
        return this.refreshTokenRepository.save(refreshToken);
    }
    async revokeRefreshToken(token) {
        await this.refreshTokenRepository.update({ token }, { isRevoked: true });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map