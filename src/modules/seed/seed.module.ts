import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([Auth, User]),
    AuthModule,
    UserModule,
  ],
})
export class SeedModule {}
