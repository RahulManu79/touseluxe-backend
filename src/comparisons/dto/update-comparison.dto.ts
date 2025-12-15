import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateComparisonDto {
  @ApiPropertyOptional({ description: 'ID of the base product' })
  @IsOptional()
  @IsString()
  baseProduct?: string;

  @ApiPropertyOptional({ description: 'ID of the inspired product' })
  @IsOptional()
  @IsString()
  inspiredProduct?: string;

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
