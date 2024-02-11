import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          '80f6dde1c368ad74e8cbf19fd673e05306e0bc3dd943d415ffcb898d9eb437d9',
      });
      // assigning payload of verified token to request object
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      // jwt decryption failed, so throw an unauthorized exception
      throw new UnauthorizedException();
    }
    return true;
  }

  // get token from authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
