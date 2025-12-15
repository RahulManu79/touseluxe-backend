import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComparisonDocument = Comparison & Document;

@Schema({ timestamps: true })
export class Comparison {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  baseProduct: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  inspiredProduct: Types.ObjectId;

  @Prop()
  similarityScore?: number;

  @Prop({ type: [String], default: [] })
  differences: string[];
}

export const ComparisonSchema = SchemaFactory.createForClass(Comparison);
