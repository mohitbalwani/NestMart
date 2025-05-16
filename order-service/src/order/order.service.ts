import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy, @Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
        @Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy,
        @InjectRepository(Order) private orderRepository: Repository<Order>) { }

    async fetchProductPrice(productId: number) {
        const product = await lastValueFrom(this.productService.send({ cmd: 'find_by_id' }, productId));
        return product.result.product.price;
    }

    async createOrder(products: any, userInfo: any) {
        let totalPrice = 0;
        const productsWithPrices = await Promise.all(
            products.map(async (product) => {
                const price = await this.fetchProductPrice(product.productId);
                totalPrice += price * product.quantity;
                return { ...product, price };
            })
        );

        const userId = userInfo.sub;

        const newOrder = await this.orderRepository.save({
            userId: userId,
            products: productsWithPrices,
            totalPrice: totalPrice
        });
        const orderId = newOrder.id;

        this.notificationService.emit({cmd: 'order_successful'}, {orderId, userInfo});
        await lastValueFrom(this.authService.emit({cmd: 'update_user_orders'}, {userId, orderId}));
        return newOrder;
    }

    async cancelOrder(data: any) {
        const orderId = data.orderId;
        const userInfo = data.userInfo;
        const order = await this.orderRepository.findOne({where: {
            id: data.orderId
        }});

        if (!order) {
            throw new Error('Order not found');
        }

        // if(data.userInfo.sub !== order.userId) {
        //     return "Nikal Bhai...Dusron ke orders delete krta hai !!";
        // }

        await this.orderRepository.delete(data.orderId);

        this.authService.emit({cmd: 'remove_user_order'}, {orderId: data.orderId, userId: order.userId});
        this.notificationService.emit({cmd: 'order_cancelled'}, {orderId, userInfo});
        return "Order cancelled !!";
    }

    async getOrderById(data: any) {
        const order = await this.orderRepository.findOne({where: {
            id: data.orderId
        }});

        return {
            order: order
        }
    }

    async getOrderHistory(userInfo: any) {
        try {
            const orderHistory = await this.orderRepository.find({where: {
                userId: userInfo.sub
            }})
            return orderHistory;
        } catch (error) {
            return error;
        }
    }
}
