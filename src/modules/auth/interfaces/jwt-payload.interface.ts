import { UserRole } from 'src/modules/user/entities/user.entity';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
