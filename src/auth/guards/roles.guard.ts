import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { userRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiresRoles = this.reflector.getAllAndOverride<userRole[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);


    const request = context.switchToHttp().getRequest()

    const user = request.user;

    const hasRole = () => requiresRoles.some((role) => user?.roles?.includes(role))
    const valid = user && user.roles && hasRole();

    console.log('User:', user)
    console.log('User roles:', user?.roles)
    console.log('Requires roles:', requiresRoles);

    if (!valid) throw new ForbiddenException("No tienes permiso para acceder a esta información.");

    return valid;
  }
}
