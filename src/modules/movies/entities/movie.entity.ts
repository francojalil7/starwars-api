import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Movie {
  @ApiProperty({ example: 1, description: 'Unique identifier of the movie' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'A New Hope', description: 'The title of the movie' })
  @Column()
  title: string;

  @ApiProperty({ example: 4, description: 'The episode number of the movie' })
  @Column({ name: 'episode_id' })
  episodeId: number;

  @ApiProperty({
    example: 'It is a period of civil war...',
    description: 'Opening text crawl of the movie',
  })
  @Column({ type: 'text', name: 'opening_crawl' })
  openingCrawl: string;

  @ApiProperty({
    example: 'George Lucas',
    description: 'Director of the movie',
  })
  @Column()
  director: string;

  @ApiProperty({
    example: 'Gary Kurtz, Rick McCallum',
    description: 'Producers of the movie',
  })
  @Column()
  producer: string;

  @ApiProperty({
    example: '1977-05-25',
    description: 'Release date of the movie',
  })
  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @ApiProperty({
    example: ['Luke Skywalker', 'Darth Vader'],
    description: 'Characters appearing in the movie',
  })
  @Column({ type: 'json', nullable: true })
  characters: string[];

  @ApiProperty({
    example: ['Tatooine', 'Alderaan'],
    description: 'Planets appearing in the movie',
  })
  @Column({ type: 'json', nullable: true })
  planets: string[];

  @ApiProperty({
    example: ['Millennium Falcon', 'X-Wing'],
    description: 'Starships appearing in the movie',
  })
  @Column({ type: 'json', nullable: true })
  starships: string[];

  @ApiProperty({
    example: ['Sand Crawler', 'Speeder Bike'],
    description: 'Vehicles appearing in the movie',
  })
  @Column({ type: 'json', nullable: true })
  vehicles: string[];

  @ApiProperty({
    example: ['Human', 'Droid'],
    description: 'Species appearing in the movie',
  })
  @Column({ type: 'json', nullable: true })
  species: string[];

  @ApiProperty({
    example: '2014-12-10T14:23:31.880Z',
    description: 'Timestamp when the movie was created',
  })
  @Column({ type: 'timestamp', nullable: true })
  created: Date;

  @ApiProperty({
    example: '2014-12-12T11:24:39.858Z',
    description: 'Timestamp when the movie was last edited',
  })
  @Column({ type: 'timestamp', nullable: true })
  edited: Date;

  @ApiProperty({
    example: 'https://swapi.dev/api/films/1/',
    description: 'URL to the movie resource',
  })
  @Column({ nullable: true })
  url: string;
}
