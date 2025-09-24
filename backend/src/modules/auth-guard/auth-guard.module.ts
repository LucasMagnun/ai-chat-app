import { forwardRef, Module } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard'
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)], // garante acesso ao AuthService
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AuthGuardModule {}
