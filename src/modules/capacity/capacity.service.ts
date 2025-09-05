import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Capacity, CapacityDocument } from './schemas/capacity.schema';
import { CreateCapacityDto } from './dto/create-capacity.dto';

@Injectable()
export class CapacityService {
  constructor(@InjectModel(Capacity.name) private model: Model<CapacityDocument>) {}

  create(dto: CreateCapacityDto) {
    const doc = new this.model({
      ...dto,
      etdUtc: new Date(dto.etdUtc),
      etaUtc: new Date(dto.etaUtc),
    });
    return doc.save();
  }

  find(query: { origin?: string; dest?: string; from?: string; to?: string }) {
    const filter: FilterQuery<CapacityDocument> = {};
    if (query.origin) filter.origin = query.origin.toUpperCase();
    if (query.dest) filter.dest = query.dest.toUpperCase();
    if (query.from || query.to) {
      filter.etdUtc = {};
      if (query.from) filter.etdUtc.$gte = new Date(query.from);
      if (query.to) filter.etdUtc.$lte = new Date(query.to);
    }
    return this.model.find(filter).sort({ etdUtc: 1 }).lean();
  }
}
