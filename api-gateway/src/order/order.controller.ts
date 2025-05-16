import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/createOrder.dto';
import { RolesGuard } from 'src/product/roles.guard';
import { Roles } from 'src/product/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('order')
export class OrderController {
    constructor(@Inject('ORDER_SERVICE') private readonly orderService: ClientProxy) {}

    @Post()
    @Roles('customer')
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createOrder(@Body() createOrderData: CreateOrderDto, @Request() req) {
        try {
            const products = createOrderData.products;
            const userInfo = req.user;
            return this.orderService.send({cmd: 'create_order'}, {products, userInfo});
        } catch (error) {
            return error;
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async cancelOrder(@Param('id', ParseIntPipe) orderId: number, @Request() req) {
        try {
            const userInfo = req.user;
            return this.orderService.send({cmd: 'cancel_order'}, {orderId, userInfo});
        } catch (error) {
            return error;
        }
    }

    @Get('history')
    @UseGuards(AuthGuard)
    async getOrderHistory(@Request() req) {
        try {
            const userInfo = req.user;
            return this.orderService.send({cmd: 'get_order_history'}, {userInfo});
        } catch (error) {
            return error;
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getOrderById(@Param('id', ParseIntPipe) orderId: number, @Request() req) {
        try {
            const userInfo = req.user;
            return this.orderService.send({cmd: 'get_order_byId'}, {orderId, userInfo});
        } catch (error) {
            return error;
        }
    }
}
