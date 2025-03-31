import { FilterMovieDto } from 'src/modules/common/dto';
import { NotFoundException } from '@nestjs/common';

import { MoviesService } from '../movies.service';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from '../dto';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let moviesRepository: any;
  let queryBuilder: any;

  beforeEach(() => {
    queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getCount: jest.fn(),
    };

    moviesRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    moviesService = new MoviesService(moviesRepository);
  });

  describe('findAll', () => {
    it('should return paginated movies with additional info', async () => {
      const filterDto: FilterMovieDto = {
        limit: 10,
        offset: 20,
        title: 'hope',
      };

      const fakeMovies: Movie[] = [
        {
          id: 1,
          title: 'A New Hope',
          episodeId: 4,
          openingCrawl: 'Opening crawl...',
          director: 'George Lucas',
          producer: 'Producer 1',
          releaseDate: new Date('1977-05-25'),
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: new Date(),
          edited: new Date(),
          url: 'https://swapi.dev/api/films/1/',
        },
        {
          id: 2,
          title: 'The Hope Continues',
          episodeId: 5,
          openingCrawl: 'Another opening crawl...',
          director: 'Some Director',
          producer: 'Producer 2',
          releaseDate: new Date('1980-05-25'),
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: new Date(),
          edited: new Date(),
          url: 'https://swapi.dev/api/films/2/',
        },
      ];

      queryBuilder.getMany.mockResolvedValue(fakeMovies);
      queryBuilder.getCount.mockResolvedValue(50);

      const result = await moviesService.findAll(filterDto);

      expect(moviesRepository.createQueryBuilder).toHaveBeenCalledWith('movie');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(movie.title) LIKE :title',
        { title: '%hope%' },
      );

      expect(queryBuilder.take).toHaveBeenCalledWith(filterDto.limit);
      expect(queryBuilder.skip).toHaveBeenCalledWith(filterDto.offset);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(queryBuilder.getCount).toHaveBeenCalled();

      expect(result).toEqual({
        results: fakeMovies,
        page: 3,
        count: 50,
        limit: filterDto.limit,
      });
    });

    it('should handle requests without filters correctly', async () => {
      const filterDto: FilterMovieDto = {};

      const fakeMovies: Movie[] = [];

      queryBuilder.getMany.mockResolvedValue(fakeMovies);
      queryBuilder.getCount.mockResolvedValue(0);

      const result = await moviesService.findAll(filterDto);

      expect(moviesRepository.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();

      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);

      expect(result).toEqual({
        results: fakeMovies,
        page: 1,
        count: 0,
        limit: 10,
      });
    });

    it('should apply all filters correctly', async () => {
      const filterDto: FilterMovieDto = {
        title: 'empire',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz',
        limit: 5,
        offset: 0,
      };

      const fakeMovies: Movie[] = [
        {
          id: 3,
          title: 'The Empire Strikes Back',
          episodeId: 5,
          openingCrawl: 'Opening crawl...',
          director: 'Irvin Kershner',
          producer: 'Gary Kurtz',
          releaseDate: new Date('1980-05-17'),
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: new Date(),
          edited: new Date(),
          url: 'https://swapi.dev/api/films/3/',
        },
      ];

      queryBuilder.getMany.mockResolvedValue(fakeMovies);
      queryBuilder.getCount.mockResolvedValue(1);

      const result = await moviesService.findAll(filterDto);

      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(movie.title) LIKE :title',
        { title: '%empire%' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(movie.director) LIKE :director',
        { director: '%irvin kershner%' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(movie.producer) LIKE :producer',
        { producer: '%gary kurtz%' },
      );

      expect(result).toEqual({
        results: fakeMovies,
        page: 1,
        count: 1,
        limit: 5,
      });
    });
  });
  describe('getMovieById', () => {
    it('should return a movie when it exists', async () => {
      const movie: Movie = {
        id: 1,
        title: 'A New Hope',
        episodeId: 4,
        openingCrawl: 'It is a period of civil war...',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        releaseDate: new Date('1977-05-25'),
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: new Date(),
        edited: new Date(),
        url: 'https://swapi.dev/api/films/1/',
      };

      moviesRepository.findOneBy = jest.fn().mockResolvedValue(movie);

      const result = await moviesService.getMovieById(1);

      expect(result).toEqual(movie);
      expect(moviesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      moviesRepository.findOneBy = jest.fn().mockResolvedValue(undefined);

      await expect(moviesService.getMovieById(99)).rejects.toThrow(
        new NotFoundException('Movie with ID 99 not found.'),
      );

      expect(moviesRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
    });
  });

  describe('createMovie', () => {
    it('should create and return a new movie with generated episodeId', async () => {
      const dto: CreateMovieDto = {
        title: 'Test Movie',
        openingCrawl: 'A test crawl...',
        director: 'Test Director',
        producer: 'Test Producer',
        releaseDate: '2000-01-01',
        characters: ['Luke', 'Leia'],
        planets: ['Tatooine'],
        starships: [],
        vehicles: [],
        species: [],
        url: 'https://example.com/movie',
      };

      const latestEpisode = { max: 5 };

      moviesRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(latestEpisode),
      });

      const mockCreated = { ...dto, episodeId: 6 };
      moviesRepository.create = jest.fn().mockReturnValue(mockCreated);
      moviesRepository.save = jest.fn().mockResolvedValue({
        ...mockCreated,
        id: 999,
      });

      const result = await moviesService.createMovie(dto);

      expect(result).toEqual({
        ...mockCreated,
        id: 999,
      });

      expect(moviesRepository.create).toHaveBeenCalledWith({
        ...dto,
        episodeId: 6,
        releaseDate: new Date(dto.releaseDate),
      });
      expect(moviesRepository.save).toHaveBeenCalled();
    });

    it('should start from episode 1 if there are no existing movies', async () => {
      const dto: CreateMovieDto = {
        title: 'First Movie',
        openingCrawl: 'First crawl',
        director: 'Director',
        producer: 'Producer',
        releaseDate: '1990-01-01',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: '',
      };

      moviesRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ max: null }),
      });

      moviesRepository.create = jest.fn().mockReturnValue({
        ...dto,
        episodeId: 1,
      });
      moviesRepository.save = jest.fn().mockResolvedValue({
        ...dto,
        episodeId: 1,
        id: 1,
      });

      const result = await moviesService.createMovie(dto);

      expect(result.episodeId).toBe(1);
      expect(result.title).toBe(dto.title);
    });
  });

  describe('updateMovie', () => {
    it('should update an existing movie', async () => {
      const dto: UpdateMovieDto = { title: 'Updated Title' };

      const preloadResult = { id: 1, title: 'Updated Title' } as Movie;

      moviesRepository.preload = jest.fn().mockResolvedValue(preloadResult);
      moviesRepository.save = jest.fn().mockResolvedValue(preloadResult);

      const result = await moviesService.updateMovie(1, dto);

      expect(moviesRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...dto,
        releaseDate: undefined,
      });

      expect(moviesRepository.save).toHaveBeenCalledWith(preloadResult);
      expect(result).toEqual(preloadResult);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      moviesRepository.preload = jest.fn().mockResolvedValue(null);

      await expect(moviesService.updateMovie(999, {})).rejects.toThrow(
        new NotFoundException('Movie with ID 999 not found.'),
      );
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      moviesRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await expect(moviesService.deleteMovie(1)).resolves.toBeUndefined();
      expect(moviesRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      moviesRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(moviesService.deleteMovie(999)).rejects.toThrowError(
        new NotFoundException('Movie with ID 999 not found.'),
      );
    });
  });

  describe('asynchandleCron', () => {
    it('should trigger syncFromSwapi internally', async () => {
      moviesService.syncFromSwapi = jest.fn().mockResolvedValue('ok');

      await moviesService.asynchandleCron();

      expect(moviesService.syncFromSwapi).toHaveBeenCalled();
    });
  });
});
