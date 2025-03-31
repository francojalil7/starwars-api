import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;

    const validRole: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRole) return true;
    if (validRole.length === 0) return true;

    if (validRole.includes(user.role)) {
      return true;
    }
    return true;
  }
}
