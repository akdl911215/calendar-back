import { ConfigModule } from '@nestjs/config';

export const CONFIG_MODULE = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});
