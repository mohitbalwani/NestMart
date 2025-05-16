import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderStatusService } from './order-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),
  ClientsModule.register([
    {
      name: 'PRODUCT_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'product_queue',
        queueOptions: {
          durable: false,
        },
      },
    }
  ]),
  ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'auth_queue',
        queueOptions: {
          durable: false,
        },
      },
    }
  ]),
  ClientsModule.register([
    {
      name: 'NOTIFICATION_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'notification_queue',
        queueOptions: {
          durable: false,
        },
      },
    }
  ])],
  controllers: [OrderController],
  providers: [OrderService] // OrderStatusService is a fun service. You can use it for notifaction triggering in the future
})
export class OrderModule {}
