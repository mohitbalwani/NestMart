import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailService } from './mail.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, MailService]
})
export class NotificationModule {}
