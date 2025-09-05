import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CapacityService } from './capacity.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';

@Controller('capacity')
@UseGuards(JwtAuthGuard)
export class CapacityController {
  constructor(private readonly service: CapacityService) {}

  @Post()
  create(@Body() dto: CreateCapacityDto) {
    return this.service.create(dto);
  }

  @Get()
  list(@Query('origin') origin?: string, @Query('dest') dest?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.service.find({ origin, dest, from, to });
  }
}
