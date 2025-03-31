import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

import { UserRoleGuard } from '../guards';

import { RoleProtected } from './';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
