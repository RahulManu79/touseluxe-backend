import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteDto {
  @ApiProperty({ description: 'Note type', example: 'top' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Note name', example: 'Bergamot' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product slug (URL-friendly name)' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Product price', example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Size in milliliters', example: 100 })
  @IsNumber()
  @Min(0)
  sizeMl: number;

  @ApiPropertyOptional({ description: 'Product images', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Fragrance notes', type: [NoteDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes?: NoteDto[];

  @ApiPropertyOptional({
    description: 'Fragrance mood',
    example: 'Fresh and Energetic',
  })
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional({
    description: 'Longevity description',
    example: '6-8 hours',
  })
  @IsOptional()
  @IsString()
  longevity?: string;

  @ApiPropertyOptional({
    description: 'Projection description',
    example: 'Moderate',
  })
  @IsOptional()
  @IsString()
  projection?: string;

  @ApiPropertyOptional({
    description: 'IDs of products this is inspired from',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inspiredFrom?: string[];
}
