import { Injectable, LoggerService as NestLogger } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLogger {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
  error(message: string, trace: string) {
    console.error(`[ERROR]: ${message}`, trace);
  }
  warn(message: string) {
    console.warn(`[WARN]: ${message}`);
  }
}
