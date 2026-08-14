import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../types/auth-user.type';
import { AuthJwtPayload } from '../types/auth.jwtPayload';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request & { user?: AuthUser }, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const payload = this.jwtService.verify<AuthJwtPayload>(token);
        req.user = { id: payload.sub } as AuthUser;
      } catch {
        // token invalid/hết hạn -> bỏ qua, coi như anonymous
      }
    }

    next();
  }
}
