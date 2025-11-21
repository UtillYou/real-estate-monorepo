import { User } from '../users/user.entity';
export declare class RefreshToken {
    id: string;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    user: User;
    userId: string;
    createdAt: Date;
}
