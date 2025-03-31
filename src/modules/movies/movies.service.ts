import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Movie } from './entities/movie.entity';
import { FilterMovieDto } from '../common/dto';
import { CreateMovieDto, UpdateMovieDto } from './dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async asynchandleCron() {
    await this.syncFromSwapi();
  }

  async findAll(filterMovieDto: FilterMovieDto): Promise<{
    results: Movie[];
    page: number;
    count: number;
    limit: number;
  }> {
    const {
      limit = 10,
      offset = 0,
      title,
      director,
      producer,
    } = filterMovieDto;
    const query = this.moviesRepository.createQueryBuilder('movie');

    if (title) {
      query.andWhere('LOWER(movie.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }
    if (director) {
      query.andWhere('LOWER(movie.director) LIKE :director', {
        director: `%${director.toLowerCase()}%`,
      });
    }
    if (producer) {
      query.andWhere('LOWER(movie.producer) LIKE :producer', {
        producer: `%${producer.toLowerCase()}%`,
      });
    }

    query.take(limit).skip(offset);

    const results = await query.getMany();
    const count = await query.getCount();
    const page = Math.floor(offset / limit) + 1;

    return { results, page, count, limit };
  }
  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    return movie;
  }

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    const latest = await this.moviesRepository
      .createQueryBuilder('movie')
      .select('MAX(movie.episodeId)', 'max')
      .getRawOne();

    const nextEpisodeId = (latest?.max ?? 0) + 1;

    const newMovie = this.moviesRepository.create({
      ...dto,
      episodeId: nextEpisodeId,
      releaseDate: new Date(dto.releaseDate),
    });

    return this.moviesRepository.save(newMovie);
  }

  async updateMovie(id: number, dto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.preload({
      id,
      ...dto,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    return this.moviesRepository.save(movie);
  }

  async deleteMovie(id: number): Promise<void> {
    const result = await this.moviesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }
  }
  async syncFromSwapi(): Promise<string> {
    const moviesCount = await this.moviesRepository.count();
    if (moviesCount > 0) {
      return 'Movies already exist. Skipping sync.';
    }

    const response = await fetch('https://swapi.dev/api/films');
    const data = await response.json();

    const movies = data.results.map((movieData) => {
      const movie = this.moviesRepository.create({
        title: movieData.title,
        episodeId: movieData.episode_id,
        openingCrawl: movieData.opening_crawl,
        director: movieData.director,
        producer: movieData.producer,
        releaseDate: new Date(movieData.release_date),
        characters: movieData.characters,
        planets: movieData.planets,
        starships: movieData.starships,
        vehicles: movieData.vehicles,
        species: movieData.species,
        created: new Date(movieData.created),
        edited: new Date(movieData.edited),
        url: movieData.url,
      });

      return movie;
    });

    await this.moviesRepository.save(movies);
    return 'Movies synced from SWAPI';
  }
}
