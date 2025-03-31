import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SeedService } from '../seed.service';
import { User } from '../../user/entities/user.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { initialData } from '../data/seed-data';

global.fetch = jest.fn();

describe('SeedService', () => {
  let service: SeedService;
  let userRepository: Repository<User>;
  let authRepository: Repository<Auth>;
  let movieRepository: Repository<Movie>;

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
              .mockResolvedValue({ ...initialData.user, id: 'test-user-id' }),
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
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            count: jest.fn().mockResolvedValue(0),
            save: jest.fn().mockResolvedValue([]),
            createQueryBuilder: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runSeed', () => {
    it('should execute seed and return success message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          results: [
            {
              title: 'A New Hope',
              episode_id: 4,
              opening_crawl: 'It is a period of civil war...',
              director: 'George Lucas',
              producer: 'Gary Kurtz, Rick McCallum',
              release_date: '1977-05-25',
              characters: [],
              planets: [],
              starships: [],
              vehicles: [],
              species: [],
              created: '2014-12-10T14:23:31.880000Z',
              edited: '2014-12-12T11:24:39.858000Z',
              url: 'https://swapi.dev/api/films/1/',
            },
          ],
        }),
      });

      const result = await service.runSeed();

      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(authRepository.createQueryBuilder).toHaveBeenCalled();

      expect(userRepository.create).toHaveBeenCalledWith(initialData.user);
      expect(userRepository.save).toHaveBeenCalled();

      expect(authRepository.create).toHaveBeenCalledWith({
        password: initialData.user.password,
        user: expect.any(Object),
      });
      expect(authRepository.save).toHaveBeenCalled();

      expect(movieRepository.count).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/films');
      expect(movieRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'A New Hope',
            episodeId: 4,
            director: 'George Lucas',
          }),
        ]),
      );

      expect(result).toBe('SEED EXECUTED');
    });

    it('should skip seeding if movies already exist', async () => {
      (movieRepository.count as jest.Mock).mockResolvedValue(6);

      const result = await service.runSeed();

      expect(movieRepository.count).toHaveBeenCalled();
      expect(movieRepository.save).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('private methods', () => {
    it('should delete tables correctly', async () => {
      await (service as any).deleteTables();

      expect(authRepository.createQueryBuilder).toHaveBeenCalled();
      expect(authRepository.createQueryBuilder().delete).toHaveBeenCalled();
      expect(authRepository.createQueryBuilder().execute).toHaveBeenCalled();

      expect(userRepository.createQueryBuilder).toHaveBeenCalled();
      expect(userRepository.createQueryBuilder().delete).toHaveBeenCalled();
      expect(userRepository.createQueryBuilder().execute).toHaveBeenCalled();
    });

    it('should insert admin correctly', async () => {
      const result = await (service as any).insertAdmin();

      expect(userRepository.create).toHaveBeenCalledWith(initialData.user);
      expect(userRepository.save).toHaveBeenCalled();

      expect(authRepository.create).toHaveBeenCalledWith({
        password: initialData.user.password,
        user: expect.any(Object),
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
