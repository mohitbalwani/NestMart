import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Order } from './order.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderStatusService implements OnModuleInit {
    private readonly logger = new Logger(OrderStatusService.name);

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authService: ClientProxy
    ) { }

    onModuleInit() {
        // Start the interval when the module is initialized
        setInterval(async () => {
            await this.updateOrderStatuses();
        }, 1 * 60 * 1000); // 15 minutes
    }

    async updateOrderStatuses() {
        const orders = await this.orderRepository.find({
            where: {
                status: Not('DELIVERED'),
            },
        });

        for (const order of orders) {
            let updated = false;
            if (order.status === 'pending') {
                order.status = 'PROCESSING';
                order.updatedAt = new Date();
                updated = true;
            } else if (order.status === 'PROCESSING') {
                order.status = 'SHIPPED'
                order.updatedAt = new Date();
                updated = true;
            } else if (order.status === 'SHIPPED') {
                order.status = 'DELIVERED';
                order.updatedAt = new Date();
                updated = true;
                const orderId = order.id;
                const userId = order.userId;
                const user = await lastValueFrom(this.authService.send({ cmd: 'get_profile' }, userId));
                const email = user.email;
                this.notificationService.emit({cmd: 'order_delivered'}, {orderId, email});
            }

            if (updated) {
                await this.orderRepository.save(order);
                this.logger.log(`Updated order ${order.id} to status ${order.status}`);
            }
        }
    }
}
