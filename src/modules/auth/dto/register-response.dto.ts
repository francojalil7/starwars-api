import { ApiProperty } from '@nestjs/swagger';

class RegisteredUserDto {
  @ApiProperty({
    example: 'Franco Jalil',
    description: 'The full name of the registered user',
  })
  fullName: string;

  @ApiProperty({
    example: 'francojalil@gmail.com',
    description: 'The email of the registered user',
  })
  email: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'User registered successfully',
    description: 'Status message',
  })
  message: string;

  @ApiProperty({
    type: RegisteredUserDto,
    description: 'User information',
  })
  user: RegisteredUserDto;
}
