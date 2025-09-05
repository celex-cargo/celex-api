import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true }) awbNo: string;
  @Prop({ required: true, enum: ['RCS','DEP','ARR','NFD','DLV'] }) code: string;
  @Prop({ required: true }) location: string;
  @Prop({ required: true }) utcTime: Date;
  @Prop() remarks?: string;
}
export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);
