import { UserRole } from 'src/modules/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';

interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
}
interface SeedData {
  user: SeedUser;
}

export const initialData: SeedData = {
  user: {
    email: 'admin@gmail.com',
    fullName: 'Test One',
    password: bcrypt.hashSync('AdminSW123!', 10),
    role: UserRole.ADMIN,
  },
};
