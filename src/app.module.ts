import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { Auth } from './modules/auth/entities/auth.entity';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { SeedModule } from './modules/seed/seed.module';
import { MoviesModule } from './modules/movies/movies.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 8080),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Auth],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    UserModule,
    SeedModule,
    MoviesModule,
  ],

  controllers: [UserController],
  providers: [],
})
export class AppModule {}
