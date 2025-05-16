import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/product.entity';

@Module({
  imports: [ProductModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        console.log("Hi from factory", process.env.PRODUCT_POSTGRES_USER);
        return {
          type: 'postgres',
          host: process.env.PRODUCT_POSTGRES_HOST,
          port: parseInt(process.env.PRODUCT_POSTGRES_PORT, 10) || 5434,
          username: process.env.PRODUCT_POSTGRES_USER,
          password: process.env.PRODUCT_POSTGRES_PASSWORD,
          database: process.env.PRODUCT_POSTGRES_DB,
          entities: [Product],
          synchronize: true, // Use with caution in production
        };
      },
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
