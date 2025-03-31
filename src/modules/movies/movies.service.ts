import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Movie } from './entities/movie.entity';
import { FilterMovieDto } from '../common/dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

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
}
