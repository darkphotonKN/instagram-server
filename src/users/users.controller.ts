import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:email')
  @UseGuards(AuthGuard)
  getUser(@Param('email') email: string) {
    return this.usersService.getUser(email);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDTO) {
    return this.usersService.signup(body);
  }
}
