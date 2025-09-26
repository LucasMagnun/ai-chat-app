import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    let token = request.headers['authorization']?.replace('Bearer ', '');

    // Se não tiver no header, tenta pegar da query (para SSE)
    if (!token && request.query?.token) {
      token = request.query.token;
    }

    if (!token) throw new UnauthorizedException('Token não fornecido');

    const user = await this.authService.validateUser(token);
    request['user'] = user;

    return true;
  }
}
