import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CalendarModule } from './calendar/calendar.module';
import { CONFIG_MODULE } from './_common/env/config.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [CONFIG_MODULE, UsersModule, CalendarModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
