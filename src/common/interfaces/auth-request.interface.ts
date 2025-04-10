import { JwtUser } from './user.interface';

export interface AuthRequest {
  user: JwtUser;
}
