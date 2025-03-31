import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
