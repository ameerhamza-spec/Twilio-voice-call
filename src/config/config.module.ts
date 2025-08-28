import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService]

})
export class ConfigModule {
  static forRoot(arg0: { isGlobal: boolean; }): import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any> {
    throw new Error('Method not implemented.');
  }
}
