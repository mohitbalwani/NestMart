import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @MessagePattern({ cmd: 'register' })
    async register(data: any) {
        return this.authService.register(data);
    }

    @MessagePattern({ cmd: 'login' })
    async login(data: any) {
        return this.authService.login(data);
    }

    @MessagePattern({ cmd: 'get_profile' })
    async getProfile(data: any) {
        return this.authService.getProfile(data);
    }

    @MessagePattern({ cmd: 'update_profile' })
    async updateProfile(data: any) {
        return this.authService.updateProfile(data);
    }

    @MessagePattern({ cmd: 'delete_profile' })
    async deleteProfile(userId: any) {
        return this.authService.deleteProfile(userId);
    }

    @EventPattern({ cmd: 'update_user_orders' })
    async updateUserOrders(data: any) {
        return this.authService.updateUserOrders(data);
    }

    @EventPattern({ cmd: 'remove_user_order' })
    async cancelUserOrder(data: any) {
        return this.authService.cancelUserOrder(data);
    }
}
