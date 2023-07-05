import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CalendarModule } from './calendar/calendar.module';
import { CONFIG_MODULE } from './_common/env/config.module';

@Module({
  imports: [CONFIG_MODULE, UsersModule, CalendarModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
