import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== 'production') {
      const now = new Date().toISOString();
      // eslint-disable-next-line no-console
      console.log(`[${now}] [${req.method}] ${req.originalUrl}`);
    }
    next();
  }
}
