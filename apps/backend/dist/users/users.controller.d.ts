import { UsersService, PublicUser } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<PublicUser[]>;
    updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<PublicUser>;
}
