import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  @Get('broker')
  @Roles(UserRole.BROKER)
  testBroker() {
    return { message: 'Access granted to BROKER' };
  }

  @Get('carrier')
  @Roles(UserRole.CARRIER)
  testCarrier() {
    return { message: 'Access granted to CARRIER' };
  }

  @Get('shipper')
  @Roles(UserRole.SHIPPER)
  testShipper() {
    return { message: 'Access granted to SHIPPER' };
  }
}
