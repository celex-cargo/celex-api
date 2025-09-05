import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Capacity, CapacitySchema } from './schemas/capacity.schema';
import { CapacityService } from './capacity.service';
import { CapacityController } from './capacity.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Capacity.name, schema: CapacitySchema }])],
  controllers: [CapacityController],
  providers: [CapacityService],
  exports: [CapacityService],
})
export class CapacityModule {}
