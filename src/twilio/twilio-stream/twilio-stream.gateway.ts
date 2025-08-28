import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws'; // pure ws server
import { WebSocket } from 'ws';
import { TranscriptionService } from '../../transcription/transcription/transcription.service';

@WebSocketGateway({
  path: '/twilio/stream', // ✅ Ensure this matches exactly
  transports: ['websocket'],
})
export class TwilioStreamGateway implements OnGatewayConnection, OnGatewayDisconnect {

  afterInit(server: any) {
    console.log('🎯 WebSocket Server INITIALIZED on port 3001, path: /twilio/stream');
    // When Twilio is trying to connect (HTTP Upgrade stage)
    server.on('headers', (headers, req) => {
      console.log('📡 Twilio attempting WS connection...', req.url);
    });

    // When raw upgrade request comes in (before accept)
    server.on('upgrade', (req) => {
      console.log('⚡ Upgrade request from Twilio', req.url, req.headers);
    });
  }



  @WebSocketServer()
  server: Server;


  constructor(private readonly transcription: TranscriptionService) { }


  async handleConnection(client: WebSocket) {
    console.log('✅ Twilio WS connected');

    client.on('message', async (data: any) => {
      try {
        const msg = JSON.parse(data.toString());

        switch (msg.event) {
          case 'start':
            console.log('📞 Media start', msg.start.callSid);
            await this.transcription.startSession(msg.start.callSid);
            break;

          case 'media':
            // msg.media.payload = base64 µ-law (PCMU) chunk
            await this.transcription.feedAudio(msg.streamSid, msg.media.payload);
            break;

          case 'stop':
            console.log('🛑 Media stop');
            await this.transcription.stopSession();
            break;

          default:
            console.log('ℹ️ Unknown WS event', msg.event);
            break;
        }
      } catch (err) {
        console.error('❌ WS parse error', err);
      }
    });

    client.on('close', async () => {
      console.log('❌ Twilio WS disconnected');
      await this.transcription.stopSession().catch(() => { });
    });
  }

  async handleDisconnect(client: WebSocket) {
    console.log('⚠️ Twilio WS forcibly disconnected');
    await this.transcription.stopSession().catch(() => { });
  }
}
