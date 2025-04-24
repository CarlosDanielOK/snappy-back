import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { userRole } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtServices: JwtService) { }
  //Agregando un comentario para poder hacer el pull sin romper nadaaaa..
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isWs = context.getType() === 'ws';

    const token = isWs
      ? context.switchToWs().getData().token
      : context
        .switchToHttp()
        .getRequest()
        .headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token no encontrado.');

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtServices.verify(token, { secret });

      user.roles = user.Roles || 'default';

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);



      if (!isWs) {
        context.switchToHttp().getRequest().user = user;
      }

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
