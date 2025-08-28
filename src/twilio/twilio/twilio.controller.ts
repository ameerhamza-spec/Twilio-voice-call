import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { TwilioSignatureGuard } from '../twilio-signature.guard/twilio-signature.guard';
import { ConfigService } from '../../config/config/config.service';
import * as twilio from 'twilio';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Twilio') // Group name in Swagger UI
@Controller('twilio')
export class TwilioController {
    constructor(private readonly config: ConfigService) { }


    @Post('voice')
    @UseGuards(TwilioSignatureGuard) // ✅ validates request from Twilio
    @ApiOperation({ summary: 'Handle incoming Twilio voice webhook' })
    @ApiResponse({ status: 200, description: 'Returns TwiML (XML) to control the call' })
    @ApiResponse({ status: 403, description: 'Invalid Twilio signature' })
    handleVoice(@Req() req: Request, @Res() res: Response) {
        console.log('📞 Incoming Twilio Voice Webhook');

        // ✅ CHANGE THIS LINE - use wss:// instead of https://
        // const streamUrl = `wss://ab8fd3972234.ngrok-free.app/twilio/stream`;

        // const VoiceResponse = twilio.twiml.VoiceResponse;
        // const twiml = new VoiceResponse();

        // // ✅ Add greeting so call doesn't immediately end
        // twiml.say('Hello! Connecting to audio stream...');

        // // ✅ Connect to WebSocket
        // twiml.connect().stream({ url: streamUrl });

        const VoiceResponse = require('twilio').twiml.VoiceResponse;

        const response = new VoiceResponse();
        const connect = response.connect();
        connect.stream({ url: 'wss://ab8fd3972234.ngrok-free.app/twilio/stream' });
        response.say(
            'This TwiML instruction is unreachable unless the Stream is ended by your WebSocket server.'
        );

        console.log(response.toString());

        res.type('text/xml');
        res.send(response.toString());
    }

}
