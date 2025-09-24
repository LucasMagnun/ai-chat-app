import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.usersRepository.findByFirebaseUid(firebaseUid);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.getAllUsers();
  }
}
