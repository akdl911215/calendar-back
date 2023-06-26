import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';

export const WINSTON_MODULE = {
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'error' : 'silly',
        format: winston.format.combine(
          winston.format.timestamp({
            format: new Date().toLocaleString('ko-KR', { hour12: true }),
          }),
          nestWinstonModuleUtilities.format.nestLike('CALENDAR', {
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'info',
      }),
      new winston.transports.File({
        filename: 'query.log',
        level: 'warn',
      }),
      new winston.transports.File({
        filename: 'errors.log',
        level: 'error',
      }),
    ],
  }),
};
