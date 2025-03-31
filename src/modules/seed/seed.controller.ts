import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Execute database seed',
    description:
      'Populates the database with initial data. Before delete existing data. Should be created user admin with this credentials: { email: admin@gmail.com, password: AdminSW123! }',
  })
  @ApiResponse({
    status: 200,
    description: 'Seed executed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'SEED EXECUTED',
        },
      },
    },
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
