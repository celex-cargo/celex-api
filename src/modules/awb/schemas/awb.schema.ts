import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Awb {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true }) bookingId: any;
  @Prop({ required: true, unique: true }) number: string; // 11-digit
  @Prop({ required: true }) checkDigit: number;
  @Prop() pdfPath?: string;
}
export type AwbDocument = HydratedDocument<Awb>;
export const AwbSchema = SchemaFactory.createForClass(Awb);
