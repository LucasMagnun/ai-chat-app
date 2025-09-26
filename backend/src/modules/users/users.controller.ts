import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMe(@Req() req: any): Promise<User | null> {
    const firebaseUid = req.user?.firebaseUid;
    if (!firebaseUid) return null;

    return this.usersService.findByFirebaseUid(firebaseUid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
