import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado!');
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido!');
    }

    const isUserAuthorized = +request.params.userId === request['user'].id;

    if (!isUserAuthorized) {
      throw new ForbiddenException(
        'Somente o usuário relacionado a ação pode acessar e agir sobre ela!',
      );
    }

    return true;
  }
}
