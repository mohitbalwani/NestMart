import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @EventPattern({cmd: 'order_successful'})
    async handleOrderSuccessful(data: any) {
        try {
            return this.notificationService.handleOrderSuccessful(data.orderId, data.userInfo);
        } catch (error) {
            return error;
        }
    }

    @EventPattern({cmd: 'order_cancelled'})
    async handleOrderCancel(data: any) {
        try {
            return this.notificationService.handleOrderCancel(data.orderId, data.userInfo);
        } catch (error) {
            return error;
        }
    }

    @EventPattern({cmd: 'order_delivered'})
    async handleOrderDelivered(data: any) {
        try {
            return this.notificationService.handleOrderDelivered(data.orderId, data.email);
        } catch (error) {
            return error;
        }
    }
}
