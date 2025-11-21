import { RefreshToken } from '../auth/refresh-token.entity';
export type UserRole = 'admin' | 'user';
export declare class User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    name: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    refreshTokens: RefreshToken[];
}
