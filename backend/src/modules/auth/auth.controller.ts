import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getProfile(@Headers('authorization') authHeader: string) {
    // login
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.validateUser(token);
  }
}
