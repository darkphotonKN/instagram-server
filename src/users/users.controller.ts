import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateProfileDTO } from './dtos/update-profile.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /*** User Admin API ***/

  // get list of users
  @Get('/list')
  @UseGuards(AuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  // new user sign up
  @Post('signup')
  signup(@Body() body: CreateUserDTO) {
    return this.usersService.signup(body);
  }

  /*** User Personal Profile ***/

  // get a single user by email
  @Get('/:email')
  @UseGuards(AuthGuard)
  getUser(@Param('email') email: string) {
    return this.usersService.getUser(email);
  }

  // posts user information for user profile
  @Patch('/profile')
  @UseGuards(AuthGuard)
  updateUserProfile(@Body() body: UpdateProfileDTO) {
    return this.usersService.updateUserProfile(body);
  }

  /*** Follow & Following */

  // follow a user via their email as id
  @Get('/follow/:email')
  @UseGuards(AuthGuard)
  followUser(@Param('email') email: string, @Req() request: any) {
    const { userId } = request.user;
    return this.usersService.followUser(userId, email);
  }
}
