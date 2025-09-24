import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firebaseApp } from '../../config/firebase.config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(token: string) {
    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(token);
      const firebaseUid = decodedToken.uid;

      let user = await this.usersService.findByFirebaseUid(firebaseUid);

      if (!user) {
        const userData : CreateUserDto = {
          firebaseUid: firebaseUid,
          email: decodedToken.email,
          name: decodedToken.name
        }
        user = await this.usersService.createUser(userData);
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
