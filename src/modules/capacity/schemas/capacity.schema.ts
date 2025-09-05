import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Capacity {
  @Prop({ required: true }) flightNo: string;
  @Prop({ required: true }) origin: string;
  @Prop({ required: true }) dest: string;
  @Prop({ required: true }) etdUtc: Date;
  @Prop({ required: true }) etaUtc: Date;
  @Prop({ required: true }) payloadKg: number;
  @Prop({ type: [String], default: [] }) uldTypes: string[];
  @Prop({ type: [String], default: ['GEN'] }) commoditiesAllowed: string[];
  @Prop({ enum: ['PUBLISHED','DRAFT','CLOSED'], default: 'PUBLISHED' }) status: string;
}
export type CapacityDocument = HydratedDocument<Capacity>;
export const CapacitySchema = SchemaFactory.createForClass(Capacity);
