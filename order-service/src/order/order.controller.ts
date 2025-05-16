import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { UserAuthorizationGuard } from './guards/userAuthz.guard';

@Controller('order')
export class OrderController {
    constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>, private readonly orderService: OrderService) {}

    @MessagePattern({cmd: 'create_order'})
    async createOrder(data: any) {
        const products = data.products;
        const userInfo = data.userInfo;
        return this.orderService.createOrder(products, userInfo);
    }

    @MessagePattern({cmd: 'cancel_order'})
    async cancelOrder(data: number) {
        return this.orderService.cancelOrder(data);
    }

    @UseGuards(UserAuthorizationGuard)
    @MessagePattern({cmd: 'get_order_byId'})
    async getOrderById(data: any) {
        try {
            return this.orderService.getOrderById(data);
        } catch (error) {
            return  {error: error.message };
        }
    }

    @MessagePattern({cmd: 'get_order_history'})
    async getOrderHistory(userInfo: any) {
        try {
            return this.orderService.getOrderHistory(userInfo);
        } catch (error) {
            return  {error: error.message };
        }
    }
}
