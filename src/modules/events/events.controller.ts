import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Get(':awbNo')
  timeline(@Param('awbNo') awbNo: string) {
    return this.service.timeline(awbNo);
  }
}
