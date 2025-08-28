import { Module } from '@nestjs/common';
import { TwilioController } from './twilio/twilio.controller';
import { TwilioSignatureGuard } from './twilio-signature.guard/twilio-signature.guard';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule], // 👈 yaha import karo
  controllers: [TwilioController],
  providers: [TwilioSignatureGuard],
  exports: [],
})
export class TwilioModule {}
