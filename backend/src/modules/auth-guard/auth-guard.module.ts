import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard'
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AuthGuardModule {}
