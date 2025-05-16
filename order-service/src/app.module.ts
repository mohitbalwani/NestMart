import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: () => {
      console.log("Hi from factory", process.env.PRODUCT_POSTGRES_USER);
      return {
        type: 'postgres',
        host: process.env.PRODUCT_POSTGRES_HOST,
        port: parseInt(process.env.PRODUCT_POSTGRES_PORT, 10) || 5436,
        username: process.env.PRODUCT_POSTGRES_USER,
        password: process.env.PRODUCT_POSTGRES_PASSWORD,
        database: process.env.PRODUCT_POSTGRES_DB,
        entities: [Order],
        synchronize: true, // Use with caution in production
      };
    },
  }), OrderModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
