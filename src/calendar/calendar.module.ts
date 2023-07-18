import { Module, ValidationPipe } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarRepository } from './calendar.repository';
import { PrismaService } from '../_common/prisma/prisma.service';

@Module({
  controllers: [CalendarController],
  providers: [
    PrismaService,
    {
      provide: 'SERVICE',
      useClass: CalendarService,
    },
    { provide: 'REPOSITORY', useClass: CalendarRepository },
  ],
})
export class CalendarModule {}
