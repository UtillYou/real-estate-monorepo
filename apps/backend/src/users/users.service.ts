import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

export type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
    
    // Remove password from the response
    return users.map(({ password, ...user }) => user);
  }

  async updateRole(id: number, role: UserRole): Promise<PublicUser> {
    await this.usersRepository.update(id, { role });
    const user = await this.usersRepository.findOneByOrFail({ id });
    const { password, ...result } = user;
    return result as PublicUser;
  }
}
