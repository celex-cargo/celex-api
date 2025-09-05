import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  status() {
    return { status: 'ok', time: new Date().toISOString() };
  }

  @Get('liveness')
  liveness() {
    return { status: 'ok', probe: 'liveness', time: new Date().toISOString() };
  }

  @Get('readiness')
  readiness() {
    return { status: 'ok', probe: 'readiness', time: new Date().toISOString() };
  }
}
