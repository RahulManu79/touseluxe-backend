import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Note {
  @Prop({ required: true })
  type: string; // 'top' | 'heart' | 'base'

  @Prop({ required: true })
  name: string;
}

const NoteSchema = SchemaFactory.createForClass(Note);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  sizeMl: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [NoteSchema], default: [] })
  notes: Note[];

  @Prop()
  mood?: string;

  @Prop()
  longevity?: string;

  @Prop()
  projection?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  inspiredFrom: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
