import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../config/prisma.module';
import { AuthGuardModule } from '../auth-guard/auth-guard.module';

@Module({
  imports: [PrismaModule, AuthGuardModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
