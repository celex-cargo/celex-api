import { Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AwbService } from './awb.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('awb')
@UseGuards(JwtAuthGuard)
export class AwbController {
  constructor(private readonly service: AwbService) {}

  @Post(':bookingId')
  create(@Param('bookingId') bookingId: string) {
    return this.service.createForBooking(bookingId);
  }

  @Get(':awbNo/pdf')
  async pdf(@Param('awbNo') awbNo: string, @Res() res: Response) {
    const awb = await this.service.findByNumber(awbNo);
    if (!awb?.pdfPath) return res.status(404).json({ message: 'AWB/PDF not found' });
    return res.sendFile(path.resolve(awb.pdfPath));
  }
}
