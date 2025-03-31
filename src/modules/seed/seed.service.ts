import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { initialData } from './data/seed-data';
import { User } from '../user/entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertAdmin();

    return 'SEED EXECUTED';
  }

  async deleteTables() {
    const queryBuilder = this.authRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();

    const userQueryBuilder = this.userRepository.createQueryBuilder();
    await userQueryBuilder.delete().where({}).execute();
  }

  async insertAdmin() {
    const seedUser = initialData.user;
    const user = this.userRepository.create(seedUser);
    await this.userRepository.save(user);

    const auth = this.authRepository.create({
      password: initialData.user.password,
      user,
    });

    await this.authRepository.save(auth);

    return {
      message: 'Seed executed',
      user: { email: initialData.user.email, role: initialData.user.role },
    };
  }
}
