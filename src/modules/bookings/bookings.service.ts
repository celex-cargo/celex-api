import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Quote, QuoteDocument } from '../quotes/schemas/quote.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private model: Model<BookingDocument>,
    @InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
  ) {}

  async create(dto: CreateBookingDto) {
    const quote = await this.quoteModel.findById(dto.quoteId);
    if (!quote) throw new NotFoundException('Quote not found');

    const doc = new this.model({
      ...dto,
      status: 'CONFIRMED',
    });
    return doc.save();
  }

  findOne(id: string) {
    return this.model.findById(id).lean();
  }
}
