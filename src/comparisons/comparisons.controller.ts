import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { UpdateComparisonDto } from './dto/update-comparison.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('comparisons')
@Controller('comparisons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comparison (Admin only)' })
  @ApiResponse({ status: 201, description: 'Comparison created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createComparisonDto: CreateComparisonDto) {
    return this.comparisonsService.create(createComparisonDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all comparisons' })
  @ApiResponse({ status: 200, description: 'Return all comparisons' })
  findAll() {
    return this.comparisonsService.findAll();
  }

  @Get('by-product')
  @Public()
  @ApiOperation({ summary: 'Get comparisons by product ID' })
  @ApiQuery({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Return comparisons for the product',
  })
  findByProduct(@Query('productId') productId: string) {
    return this.comparisonsService.findByProduct(productId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get comparison by ID' })
  @ApiResponse({ status: 200, description: 'Return the comparison' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  findOne(@Param('id') id: string) {
    return this.comparisonsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comparison (Admin only)' })
  @ApiResponse({ status: 200, description: 'Comparison updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  update(
    @Param('id') id: string,
    @Body() updateComparisonDto: UpdateComparisonDto,
  ) {
    return this.comparisonsService.update(id, updateComparisonDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comparison (Admin only)' })
  @ApiResponse({ status: 200, description: 'Comparison deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  remove(@Param('id') id: string) {
    return this.comparisonsService.remove(id);
  }
}
