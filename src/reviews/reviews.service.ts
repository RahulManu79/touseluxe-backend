import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}
  F;

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const createdReview = new this.reviewModel({
      ...createReviewDto,
      user: userId,
    });
    const saved = await createdReview.save();
    await saved.populate('user');
    await saved.populate('product');
    return saved;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().populate('user').populate('product').exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('user')
      .populate('product')
      .exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ product: productId })
      .populate('user')
      .populate('product')
      .exec();
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ user: userId })
      .populate('user')
      .populate('product')
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user.toString() !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('user')
      .populate('product')
      .exec();

    return updatedReview!;
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewModel.findByIdAndDelete(id).exec();
  }
}
