import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { ConfigService } from '../../../config/config/config.service';

@Injectable()
export class DeepgramService {
  private ws?: WebSocket;

  constructor(private readonly config: ConfigService) {}

  async open(callSid?: string) {
    return new Promise<void>((resolve, reject) => {
      const url = 'wss://api.deepgram.com/v1/listen?encoding=mulaw&sample_rate=8000&punctuate=true&interim_results=true';
      this.ws = new WebSocket(url, {
        headers: { Authorization: `Token ${this.config.deepgramApiKey}` },
      });
      this.ws.on('open', () => {
        console.log('Deepgram WS open');
        resolve();
      });
      this.ws.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          if (transcript) console.log('Transcript:', transcript);
        } catch (e) {
          // ignore non-json messages
        }
      });
      this.ws.on('error', (err) => {
        console.error('Deepgram WS error', err);
        reject(err);
      });
      this.ws.on('close', () => console.log('Deepgram WS closed'));
    });
  }

  async sendBase64Mulaw(b64: string): Promise<boolean> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    // send raw binary (Deepgram expects linear PCM; Twilio sends µ-law; query param encoding=mulaw set in URL)
    const buf = Buffer.from(b64, 'base64');
    this.ws.send(buf);
    return true;
  }

  async close(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.ws = undefined;
  }
}
