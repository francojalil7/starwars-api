import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { initialData } from './data/seed-data';
import { User } from '../user/entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.insertAdmin();

    const moviesCount = await this.moviesRepository.count();
    if (moviesCount > 0) {
      this.logger.log('Movies already seeded. Skipping seed.');
      return;
    }

    try {
      const response = await fetch('https://swapi.dev/api/films');
      const data = await response.json();
      const moviesData = data.results;

      const movies = moviesData.map((movieData) => {
        const movie = new Movie();
        movie.title = movieData.title;
        movie.episodeId = movieData.episode_id;
        movie.openingCrawl = movieData.opening_crawl;
        movie.director = movieData.director;
        movie.producer = movieData.producer;
        movie.releaseDate = new Date(movieData.release_date);
        movie.characters = movieData.characters;
        movie.planets = movieData.planets;
        movie.starships = movieData.starships;
        movie.vehicles = movieData.vehicles;
        movie.species = movieData.species;
        movie.created = new Date(movieData.created);
        movie.edited = new Date(movieData.edited);
        movie.url = movieData.url;
        return movie;
      });

      await this.moviesRepository.save(movies);
      this.logger.log('Seed completed: Movies have been added.');
      return 'SEED EXECUTED';
    } catch (error) {
      this.logger.error('Error while seeding movies', error);
    }
  }

  async deleteTables() {
    const queryBuilder = this.authRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();

    const userQueryBuilder = this.userRepository.createQueryBuilder();
    await userQueryBuilder.delete().where({}).execute();
  }

  async insertAdmin() {
    const seedUser = initialData.user;
    const user = this.userRepository.create(seedUser);
    await this.userRepository.save(user);

    const auth = this.authRepository.create({
      password: initialData.user.password,
      user,
    });

    await this.authRepository.save(auth);

    return {
      message: 'Seed executed',
      user: { email: initialData.user.email, role: initialData.user.role },
    };
  }
}
