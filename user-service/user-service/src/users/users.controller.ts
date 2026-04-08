import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('users/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req: any) {
    const data = await this.usersService.getMe(req.user.id);
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Get('users/permissions')
  @UseGuards(AuthGuard('jwt'))
  async getPermissions(@Request() req: any) {
    const data = await this.usersService.getPermissions(req.user.id);
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    const data = await this.usersService.getAll();
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async getById(@Param('id') id: string) {
    const data = await this.usersService.getById(id);
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Post('users')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateUserDto) {
    const data = await this.usersService.create(body);
    return { statusCode: 201, intOpCode: 0, data };
  }

  @Put('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const data = await this.usersService.update(id, body);
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Put('users/:id/permissions')
  @UseGuards(AuthGuard('jwt'))
  async setPermissions(@Param('id') id: string, @Body() body: { permissions: string[] }) {
    const data = await this.usersService.setPermissions(id, body.permissions);
    return { statusCode: 200, intOpCode: 0, data };
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    const data = await this.usersService.delete(id);
    return { statusCode: 200, intOpCode: 0, data };
  }
}