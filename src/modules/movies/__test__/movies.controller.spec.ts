import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { CreateMovieDto, UpdateMovieDto } from '../dto';
import { FilterMovieDto } from '../../common/dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMovie = {
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

  const mockService = {
    findAll: jest.fn(),
    getMovieById: jest.fn(),
    createMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should call service.findAll and return movies', async () => {
      const filterDto: FilterMovieDto = {};
      const result = { results: [mockMovie], page: 1, count: 1, limit: 10 };
      mockService.findAll.mockResolvedValue(result);

      const response = await controller.getMovies(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(response).toEqual(result);
    });
  });

  describe('getMovieById', () => {
    it('should call service.getMovieById and return one movie', async () => {
      mockService.getMovieById.mockResolvedValue(mockMovie);

      const response = await controller.getMovieById(1);

      expect(service.getMovieById).toHaveBeenCalledWith(1);
      expect(response).toEqual(mockMovie);
    });
  });

  describe('create', () => {
    it('should call service.createMovie and return created movie', async () => {
      const dto: CreateMovieDto = {
        title: 'A New Hope',
        openingCrawl: '...',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        releaseDate: '1977-05-25',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        url: 'https://swapi.dev/api/films/1/',
      };

      mockService.createMovie.mockResolvedValue(mockMovie);

      const response = await controller.create(dto);

      expect(service.createMovie).toHaveBeenCalledWith(dto);
      expect(response).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    it('should call service.updateMovie and return updated movie', async () => {
      const dto: UpdateMovieDto = { title: 'New Title' };
      const updatedMovie = { ...mockMovie, title: 'New Title' };

      service.updateMovie = jest.fn().mockResolvedValue(updatedMovie);

      const result = await controller.update(1, dto);

      expect(service.updateMovie).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Movie updated successfully',
        movie: updatedMovie,
      });
    });
    it('should throw NotFoundException if movie not found', async () => {
      const dto: UpdateMovieDto = { title: 'New Title' };

      service.updateMovie = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException('Movie with ID 123 not found.'),
        );

      await expect(controller.update(123, dto)).rejects.toThrow(
        new NotFoundException('Movie with ID 123 not found.'),
      );
    });
  });

  describe('delete', () => {
    it('should call service.deleteMovie and return success message', async () => {
      service.deleteMovie = jest.fn().mockResolvedValue(undefined);

      const response = await controller.delete(1);

      expect(service.deleteMovie).toHaveBeenCalledWith(1);
      expect(response).toEqual({
        statusCode: 200,
        message: 'Movie with ID 1 deleted successfully.',
      });
    });
  });

  describe('sync', () => {
    it('should call service.syncFromSwapi and return message', async () => {
      const syncMessage = 'Movies synced from SWAPI';
      service.syncFromSwapi = jest.fn().mockResolvedValue(syncMessage);

      const result = await controller.sync();

      expect(service.syncFromSwapi).toHaveBeenCalled();
      expect(result).toEqual({ message: syncMessage });
    });
  });
});
