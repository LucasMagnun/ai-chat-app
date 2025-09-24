import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../config/prisma.module';
import { AuthGuardModule } from '../auth-guard/auth-guard.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthGuardModule),
    forwardRef(() => AuthModule), // <-- adiciona isso
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
