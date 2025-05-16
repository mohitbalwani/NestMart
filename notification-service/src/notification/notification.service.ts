import { Inject, Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Injectable()
export class NotificationService {
    constructor(private readonly mailService: MailService) {}

    async handleOrderSuccessful(orderId: number, userInfo: any) {
        const userEmail = userInfo.email;
        await this.mailService.sendMail(userEmail, 'Order Successful', `Your order with ID ${orderId} has been successfully placed.`);
    }

    async handleOrderCancel(orderId: number, userInfo: any) {
        const userEmail = userInfo.email;
        await this.mailService.sendMail(userEmail, 'Order Cancelled', `Your order with ID ${orderId} has been cancelled !!`);
    }

    async handleOrderDelivered(orderId: number, email: string) {
        // console.log(email);
        await this.mailService.sendMail(email, 'Order Delivered', `Your order with ID ${orderId} has been Delivered !!`);
    }
}
