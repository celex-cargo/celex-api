import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Awb, AwbSchema } from './schemas/awb.schema';
import { AwbService } from './awb.service';
import { AwbController } from './awb.controller';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Awb.name, schema: AwbSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [AwbController],
  providers: [AwbService],
  exports: [AwbService],
})
export class AwbModule {}
