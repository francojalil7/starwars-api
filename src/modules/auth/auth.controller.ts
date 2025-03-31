import { Controller, Post, Body, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginUserDto, RegisterUserDto } from './dto';
import {
  ApiChangePassword,
  ApiLoginUser,
  ApiRegisterUser,
  Auth,
} from './decorators';
import { User } from '../user/entities/user.entity';
import { RequestWithUser } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @ApiRegisterUser()
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('singin')
  @ApiLoginUser()
  loginUser(@Body() loginDto: LoginUserDto) {
    return this.authService.loginUser(loginDto);
  }

  @Patch('change-password')
  @Auth()
  @ApiChangePassword()
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ) {
    const userId = req.user['id'];
    return this.authService.changePassword(userId, dto);
  }
}
