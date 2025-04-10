import { JwtUser } from '../common/interfaces/user.interface';

declare module 'express' {
  interface Request {
    user?: JwtUser;
  }
}
