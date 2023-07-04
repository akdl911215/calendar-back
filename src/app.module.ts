import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CalendarModule } from './calendar/calendar.module';
import { CONFIG_MODULE } from './_common/env/config.module';
import { UsersCurrentPasswordMiddleware } from './users/infrastructure/middleware/users.current.password.middleware';

@Module({
  imports: [CONFIG_MODULE, UsersModule, CalendarModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(UsersCurrentPasswordMiddleware).forRoutes(
      {
        path: 'user/update',
        method: RequestMethod.PATCH,
      },
      { path: 'user', method: RequestMethod.GET },
    );
  }
}
