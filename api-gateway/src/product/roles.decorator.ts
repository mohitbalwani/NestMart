import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// SetMetadata is a function provided by NestJS that attaches custom metadata to the route handler.

// Execution Flow for RBAC here

// Roles Decorator: Attaches roles metadata to the route handler.
// Roles Guard: Uses the Reflector to get the roles metadata and checks the user's role by communicating with the auth service.
// Integration: Apply the Roles decorator and the RolesGuard to routes to enforce RBAC.


// Interesting
// Decorator Execution Time: The decorator function is executed at the time the class or method is being defined,
// which is typically when the application starts up.

