import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from './schemas/quote.schema';
import { CreateQuoteDto } from './dto/create-quote.dto';

type RateCard = { [lane: string]: number };

@Injectable()
export class QuotesService {
  private defaultRates: RateCard = { 'URC-VIE': 4.0 }; // €/kg
  private securityFixed = 15;  // €
  private handlingFixed = 20;  // €
  private fuelPct = 0.12;      // 12%
  private warPct = 0.03;       // 3%

  constructor(@InjectModel(Quote.name) private model: Model<QuoteDocument>) {}

  async create(dto: CreateQuoteDto) {
    const lane = `${dto.origin?.toUpperCase()}-${dto.dest?.toUpperCase()}`;
    const ratePerKg = this.defaultRates[lane] ?? 5.0;

    const volKg = (dto.dims || []).reduce((sum, d) => sum + ((d.l * d.w * d.h) / 6000) * d.pcs, 0);
    const chargeableKg = Math.max(dto.grossKg, Math.ceil(volKg));

    const base = +(ratePerKg * chargeableKg).toFixed(2);
    const fuel = +(base * this.fuelPct).toFixed(2);
    const war = +(base * this.warPct).toFixed(2);
    const security = this.securityFixed;
    const handling = this.handlingFixed;
    const total = +(base + fuel + war + security + handling).toFixed(2);

    const doc = new this.model({
      origin: dto.origin.toUpperCase(),
      dest: dto.dest.toUpperCase(),
      grossKg: dto.grossKg,
      dims: dto.dims || [],
      chargeableKg,
      ratePerKg,
      breakdown: { base, fuel, war, security, handling, total },
    });

    return doc.save();
  }

  findOne(id: string) {
    return this.model.findById(id).lean();
  }
}
