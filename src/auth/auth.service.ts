import * as bcrypt from 'bcrypt';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignInDTO } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';

type JwtSignPayload = {
  sub: number;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    // repository injection
    @InjectRepository(User) private usersRepo: Repository<User>,
    // jwt service injection
    private jwtService: JwtService,
  ) {}

  // authenticate user signin and provide user info
  async signin({
    email,
    password,
  }: SignInDTO): Promise<{ user: User; accessToken: string }> {
    // check if user even exists before authenticating
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    // check if password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid login credentials.');
    }

    // if successful, generate jwt token and return user
    const jwtSignPayload: JwtSignPayload = {
      sub: user.id,
      username: user.name,
    };
    const accessToken = this.generateJwtToken(jwtSignPayload);
    return {
      user,
      accessToken,
    };
  }

  // generate jwt token
  generateJwtToken(payload: JwtSignPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
