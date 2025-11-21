import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
export type PublicUser = Omit<User, 'password'>;
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<PublicUser[]>;
    updateRole(id: number, role: UserRole): Promise<PublicUser>;
}
