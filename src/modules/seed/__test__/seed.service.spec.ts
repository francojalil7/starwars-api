import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';

import { SeedService } from '../seed.service';
import { initialData } from '../data/seed-data';

describe('SeedService', () => {
  let service: SeedService;
  let userRepository: Repository<User>;
  let authRepository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((user) =>
                Promise.resolve({ ...user, id: 'test-id' }),
              ),
          },
        },
        {
          provide: getRepositoryToken(Auth),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runSeed', () => {
    it('should execute seed and return success message', async () => {
      const deleteTablesSpy = jest.spyOn(service as any, 'deleteTables');
      const insertAdminSpy = jest.spyOn(service as any, 'insertAdmin');

      const result = await service.runSeed();

      expect(deleteTablesSpy).toHaveBeenCalled();
      expect(insertAdminSpy).toHaveBeenCalled();
      expect(result).toBe('SEED EXECUTED');
    });
  });

  describe('private methods', () => {
    it('should delete tables when deleteTables is called', async () => {
      await (service as any).deleteTables();

      expect(authRepository.createQueryBuilder).toHaveBeenCalled();
      expect(authRepository.createQueryBuilder().delete).toHaveBeenCalled();
      expect(authRepository.createQueryBuilder().where).toHaveBeenCalled();
      expect(authRepository.createQueryBuilder().execute).toHaveBeenCalled();

      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(userRepository.createQueryBuilder().delete).toHaveBeenCalled();
      expect(userRepository.createQueryBuilder().where).toHaveBeenCalled();
      expect(userRepository.createQueryBuilder().execute).toHaveBeenCalled();
    });

    it('should insert admin user when insertAdmin is called', async () => {
      const result = await (service as any).insertAdmin();

      expect(userRepository.create).toHaveBeenCalledWith(initialData.user);
      expect(userRepository.save).toHaveBeenCalled();

      expect(authRepository.create).toHaveBeenCalledWith({
        password: initialData.user.password,
        user: expect.anything(),
      });
      expect(authRepository.save).toHaveBeenCalled();

      expect(result).toEqual({
        message: 'Seed executed',
        user: {
          email: initialData.user.email,
          role: initialData.user.role,
        },
      });
    });
  });
});
