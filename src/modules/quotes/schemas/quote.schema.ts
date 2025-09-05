import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class QuoteBreakdown {
  @Prop() base: number;
  @Prop() fuel: number;
  @Prop() war: number;
  @Prop() security: number;
  @Prop() handling: number;
  @Prop() total: number;
}

@Schema({ timestamps: true })
export class Quote {
  @Prop({ required: true }) origin: string;
  @Prop({ required: true }) dest: string;
  @Prop({ required: true }) grossKg: number;
  @Prop({ type: [{ l: Number, w: Number, h: Number, pcs: Number }], default: [] }) dims: Array<{l:number;w:number;h:number;pcs:number}>;
  @Prop({ required: true }) chargeableKg: number;
  @Prop({ required: true }) ratePerKg: number;
  @Prop({ type: QuoteBreakdown }) breakdown: QuoteBreakdown;
}

export type QuoteDocument = HydratedDocument<Quote>;
export const QuoteSchema = SchemaFactory.createForClass(Quote);
