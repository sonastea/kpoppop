import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  async root() {
    return "You have reached kpoppop's api endpoint.";
  }
}
