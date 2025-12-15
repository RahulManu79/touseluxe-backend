import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComparisonDto {
  @ApiProperty({ description: 'ID of the base product' })
  @IsString()
  @IsNotEmpty()
  baseProduct: string;

  @ApiProperty({ description: 'ID of the inspired product' })
  @IsString()
  @IsNotEmpty()
  inspiredProduct: string;

  @ApiPropertyOptional({ description: 'Similarity score (0-100)', example: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  similarityScore?: number;

  @ApiPropertyOptional({ description: 'List of differences', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  differences?: string[];
}
