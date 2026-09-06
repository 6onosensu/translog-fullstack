import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../../users/enums/user-role.enum";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const reqiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if(!reqiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role: UserRole };

    return reqiredRoles.includes(user.role);
  }
}