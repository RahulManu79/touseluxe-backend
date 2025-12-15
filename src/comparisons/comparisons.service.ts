import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comparison, ComparisonDocument } from './schemas/comparison.schema';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { UpdateComparisonDto } from './dto/update-comparison.dto';

@Injectable()
export class ComparisonsService {
  constructor(
    @InjectModel(Comparison.name)
    private comparisonModel: Model<ComparisonDocument>,
  ) {}

  async create(createComparisonDto: CreateComparisonDto): Promise<Comparison> {
    const createdComparison = new this.comparisonModel(createComparisonDto);
    const saved = await createdComparison.save();
    await saved.populate('baseProduct');
    await saved.populate('inspiredProduct');
    return saved;
  }

  async findAll(): Promise<Comparison[]> {
    return this.comparisonModel
      .find()
      .populate('baseProduct')
      .populate('inspiredProduct')
      .exec();
  }

  async findOne(id: string): Promise<Comparison> {
    const comparison = await this.comparisonModel
      .findById(id)
      .populate('baseProduct')
      .populate('inspiredProduct')
      .exec();
    if (!comparison) {
      throw new NotFoundException(`Comparison with ID ${id} not found`);
    }
    return comparison;
  }

  async findByProduct(productId: string): Promise<Comparison[]> {
    return this.comparisonModel
      .find({
        $or: [{ baseProduct: productId }, { inspiredProduct: productId }],
      })
      .populate('baseProduct')
      .populate('inspiredProduct')
      .exec();
  }

  async update(
    id: string,
    updateComparisonDto: UpdateComparisonDto,
  ): Promise<Comparison> {
    const updatedComparison = await this.comparisonModel
      .findByIdAndUpdate(id, updateComparisonDto, { new: true })
      .populate('baseProduct')
      .populate('inspiredProduct')
      .exec();
    if (!updatedComparison) {
      throw new NotFoundException(`Comparison with ID ${id} not found`);
    }
    return updatedComparison;
  }

  async remove(id: string): Promise<void> {
    const result = await this.comparisonModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Comparison with ID ${id} not found`);
    }
  }
}
