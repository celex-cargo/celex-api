import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Quote', required: true }) quoteId: any;
  @Prop({ type: Object, required: true }) shipper: { name: string };
  @Prop({ type: Object, required: true }) consignee: { name: string };
  @Prop({ required: true }) pieces: number;
  @Prop({ required: true }) grossKg: number;
  @Prop({ default: 'CONFIRMED' }) status: string;
  @Prop() remarks?: string;
}
export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
