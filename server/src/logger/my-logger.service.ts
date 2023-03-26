import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  constructor() {
    super();
  }
}
