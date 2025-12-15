import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NoteDto {
  @ApiPropertyOptional({ description: 'Note type', example: 'top' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Note name', example: 'Bergamot' })
  @IsString()
  name: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Product slug (URL-friendly name)' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price', example: 29.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Size in milliliters', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sizeMl?: number;

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
