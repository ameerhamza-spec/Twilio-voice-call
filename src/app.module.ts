import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioModule } from './twilio/twilio.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioStreamGateway } from './twilio/twilio-stream/twilio-stream.gateway';
import { TranscriptionService } from './transcription/transcription/transcription.service';
import { DeepgramService } from './transcription/vendors/deepgram/deepgram.service';
import { ConfigService } from './config/config/config.service';
import { TwilioController } from './twilio/twilio/twilio.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TwilioModule,
    TranscriptionModule,
  ],
  controllers: [AppController, TwilioController],
  providers: [
    AppService,
    TwilioStreamGateway, // ✅ Yahan add karo
    TranscriptionService,
    DeepgramService,
    ConfigService
  ],
})
export class AppModule { }