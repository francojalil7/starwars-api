import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MoviesService } from './movies.service';
import { ApiGetMovieById, ApiGetMovies } from './decorators';
import { FilterMovieDto } from '../common/dto';
import { Auth } from '../auth/decorators';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiGetMovies()
  async getMovies(@Query() paginationDto: FilterMovieDto) {
    return await this.moviesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiGetMovieById()
  @Auth(UserRole.USER)
  getMovieById(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieById(id);
  }
}
