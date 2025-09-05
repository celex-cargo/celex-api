import { UserRole } from '../../common/roles.enum';

export interface JwtPayload {
  sub: string;         // user ID
  email: string;
  role: UserRole;
}
