import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
