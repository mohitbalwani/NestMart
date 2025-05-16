import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthorizationGuard implements CanActivate {
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const data = context.switchToRpc().getData();
        const userId = data.userInfo.sub;
        const orderId = data.orderId;

        const order = await this.orderRepository.findOne({
            where: {
                id: orderId
            }
        });

        if (!order) {
            throw new ForbiddenException('Order not found');
        }

        if (order.userId !== userId) {
            throw new ForbiddenException('Access Denied: You do not own this order');
        }

        return true;
    }
}
