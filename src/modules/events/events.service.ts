import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private model: Model<EventDocument>) {}

  create(dto: CreateEventDto) {
    return this.model.create({
      ...dto,
      utcTime: new Date(dto.utcTime),
    });
  }

  timeline(awbNo: string) {
    return this.model.find({ awbNo }).sort({ utcTime: 1 }).lean();
  }
}
