import 'dotenv/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get port(): number { return parseInt(process.env.PORT || '3000', 10); }
  get publicHost(): string { return process.env.PUBLIC_HOST || ''; }
  get twilioAuthToken(): string { return process.env.TWILIO_AUTH_TOKEN || ''; }
  get deepgramApiKey(): string { return process.env.DEEPGRAM_API_KEY || process.env.DEEPGRAM_API_KEY || ''; }
}
