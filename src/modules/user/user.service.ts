import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUserByEmailDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async getByEmail(getUserByEmailDto: GetUserByEmailDto) {
    const { email } = getUserByEmailDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, id: true, role: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    return user;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }
}
