import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto, RegisterResponseDto } from './dto';
import { Auth } from './entities/auth.entity';
import { RegisterUserDto } from './dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
  ) {}
  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const user = await this.userService.create({
      fullName: registerUserDto.fullName,
      email: registerUserDto.email,
    });

    const auth = this.authRepository.create({
      password: hashedPassword,
      user,
    });

    await this.authRepository.save(auth);

    return {
      message: 'User registered successfully',
      user: {
        fullName: registerUserDto.fullName,
        email: registerUserDto.email,
      },
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userService.getByEmail({ email });
    const auth = await this.authRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!auth || !(await bcrypt.compare(password, auth.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'User logged in successfully',
      accessToken: this.getJWT(payload),
    };
  }

  private getJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
