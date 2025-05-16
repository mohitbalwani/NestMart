import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { Request } from 'express';
import { lastValueFrom } from "rxjs";

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy, private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if(!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret:'JWT_SCRET_KEY'
                }
            );
            request['user'] = payload;
            const userInfo = await lastValueFrom(this.authClient.send({ cmd: 'get_profile' }, payload.sub));
            return requiredRoles.includes(userInfo.role);
        } catch {
            return false;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    
}