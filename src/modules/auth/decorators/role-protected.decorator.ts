import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/entities/user.entity';
export const META_ROLES = 'role-protected';

export const RoleProtected = (...args: UserRole[]) =>
  SetMetadata(META_ROLES, args);
