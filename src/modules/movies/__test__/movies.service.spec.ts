import { FilterMovieDto } from 'src/modules/common/dto';
import { NotFoundException } from '@nestjs/common';

import { MoviesService } from '../movies.service';
import { Movie } from '../entities/movie.entity';

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
});
