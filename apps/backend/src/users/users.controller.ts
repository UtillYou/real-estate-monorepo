import { Controller, Get, UseGuards, Put, Param, Body, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService, PublicUser } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Role('admin')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  @Put(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<PublicUser> {
    return this.usersService.updateRole(id, updateUserRoleDto.role);
  }
}
