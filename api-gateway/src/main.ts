import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8888);
  console.log('API_GATEWAY is listening at 8888');
}
bootstrap();
