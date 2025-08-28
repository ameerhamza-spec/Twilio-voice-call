import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { ConfigService } from '../../config/config/config.service';

@Injectable()
export class TwilioSignatureGuard implements CanActivate {
    constructor(private readonly config: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const token = this.config.twilioAuthToken;
        const signature = req.headers['x-twilio-signature'] as string | undefined;
        const url = (this.config.publicHost || '') + req.originalUrl;
        const params = req.body || {};


        console.log("middleware", token, signature, url)
        if (!token || !signature || !url) return false;
        const ok = twilio.validateRequest(token, signature, url, params);
        if (!ok) console.warn('Invalid Twilio signature for request to', url);
        return ok;
    }
}
