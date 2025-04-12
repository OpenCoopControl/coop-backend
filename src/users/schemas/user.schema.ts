import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    unique: true,
    default: () => Math.floor(1000000 + Math.random() * 9000000).toString(),
  })
  connectionId: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  verificationToken?: string;

  @Prop()
  verificationTokenExpires?: Date;

  @Prop({ type: [{ type: String, ref: 'Device' }], default: [] })
  devices: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
