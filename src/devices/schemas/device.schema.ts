import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Device extends Document {
  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ default: 'offline' })
  status: string;

  @Prop()
  lastSeen: Date;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  type: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
