import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPass123!',
    description: 'Your current password to authenticate the change.',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'NewPass123!',
    description: 'The new password you want to set (minimum 6 characters).',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
