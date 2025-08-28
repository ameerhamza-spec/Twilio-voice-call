import { Injectable } from '@nestjs/common';
import { DeepgramService } from '../vendors/deepgram/deepgram.service';

@Injectable()
export class TranscriptionService {
  constructor(private readonly deepgram: DeepgramService) {}

  async startSession(callSid: string) {
    // open connection to Deepgram (or init per-call instances)
    await this.deepgram.open(callSid);
  }

  async feedAudio(streamSid: string, base64Payload: string) {
    // forward the base64 mulaw to Deepgram
    const ok = await this.deepgram.sendBase64Mulaw(base64Payload);
    if (!ok) {
      // buffer or retry logic could be added here
    }
  }

  async stopSession() {
    await this.deepgram.close();
  }
}
