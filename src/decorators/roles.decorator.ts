import { SetMetadata } from "@nestjs/common";
import { userRole } from "src/users/entities/user.entity";

export const Roles = (...roles: userRole[]) => SetMetadata("roles", roles);