import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription/transcription.service';
import { DeepgramService } from './vendors/deepgram/deepgram.service';
import { ConfigModule } from 'src/config/config.module';


@Module({
  imports: [ConfigModule], // 👈 yaha import karo
  providers: [TranscriptionService, DeepgramService]
})
export class TranscriptionModule {}
