import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';

import { AuthService } from '../auth.service';
import { Auth } from '../entities/auth.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let authRepository: any;
  let userService: any;

  const mockJwtService = {
    sign: jest.fn(() => 'signedToken'),
  };

  const mockAuthRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
    getByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(Auth), useValue: mockAuthRepository },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    authRepository = module.get(getRepositoryToken(Auth));
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('debe registrar un usuario correctamente', async () => {
      const registerUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: 1,
        fullName: registerUserDto.fullName,
        email: registerUserDto.email,
      };
      mockUserService.create.mockResolvedValue(createdUser);

      const createdAuth = { password: 'hashedPassword', user: createdUser };
      mockAuthRepository.create.mockReturnValue(createdAuth);
      mockAuthRepository.save.mockResolvedValue(createdAuth);

      const result = await authService.registerUser(registerUserDto);

      expect(mockUserService.create).toHaveBeenCalledWith({
        fullName: registerUserDto.fullName,
        email: registerUserDto.email,
      });
      expect(mockAuthRepository.create).toHaveBeenCalledWith({
        password: expect.any(String),
        user: createdUser,
      });
      expect(mockAuthRepository.save).toHaveBeenCalledWith(createdAuth);

      expect(result).toEqual({
        message: 'User registered successfully',
        user: {
          fullName: registerUserDto.fullName,
          email: registerUserDto.email,
        },
      });
    });
  });

  describe('loginUser', () => {
    it('debe lanzar error si los datos de entrada son inválidos', async () => {
      await expect(
        authService.loginUser({ email: '', password: '' }),
      ).rejects.toThrow();
    });

    it('debe loguear al usuario correctamente cuando las credenciales son válidas', async () => {
      const loginUserDto = {
        email: 'franco@gmail.com',
        password: 'password123',
      };

      const user = { id: 1, email: 'john@example.com', role: 'user' };

      const hashedPassword = await bcrypt.hash(loginUserDto.password, 10);
      const authRecord = { password: hashedPassword, user };

      mockUserService.getByEmail.mockResolvedValue(user);
      mockAuthRepository.findOne.mockResolvedValue(authRecord);

      const result = await authService.loginUser(loginUserDto);

      expect(mockUserService.getByEmail).toHaveBeenCalledWith({
        email: loginUserDto.email,
      });
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: user.id } },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({
        message: 'User logged in successfully',
        accessToken: 'signedToken',
      });
    });

    it('debe lanzar UnauthorizedException cuando las credenciales son incorrectas', async () => {
      const loginUserDto = {
        email: 'franco@example.com',
        password: 'wrongPassword',
      };

      const user = { id: 1, email: 'john@example.com', role: 'user' };

      const correctHashedPassword = await bcrypt.hash('password123', 10);
      const authRecord = { password: correctHashedPassword, user };

      mockUserService.getByEmail.mockResolvedValue(user);
      mockAuthRepository.findOne.mockResolvedValue(authRecord);

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );

      mockAuthRepository.findOne.mockResolvedValue(null);
      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('debe propagar un error si jwtService.sign falla', async () => {
      const loginUserDto = {
        email: 'franco@example.com',
        password: 'password123',
      };
      const user = { id: 1, email: 'franco@example.com', role: 'USER' };
      const hashedPassword = await bcrypt.hash(loginUserDto.password, 10);
      const authRecord = { password: hashedPassword, user };

      mockUserService.getByEmail.mockResolvedValue(user);
      mockAuthRepository.findOne.mockResolvedValue(authRecord);
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT Error');
      });

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        'JWT Error',
      );
    });

    it('debe enviar el payload correcto a jwtService.sign', async () => {
      mockJwtService.sign.mockImplementation(() => 'signedToken');

      const loginUserDto = {
        email: 'franco@example.com',
        password: 'password123',
      };
      const user = { id: 1, email: 'franco@example.com', role: 'USER' };
      const hashedPassword = await bcrypt.hash(loginUserDto.password, 10);
      const authRecord = { password: hashedPassword, user };

      mockUserService.getByEmail.mockResolvedValue(user);
      mockAuthRepository.findOne.mockResolvedValue(authRecord);

      await authService.loginUser(loginUserDto);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    });
  });
});
