import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComparisonsService } from './comparisons.service';
import { ComparisonsController } from './comparisons.controller';
import { Comparison, ComparisonSchema } from './schemas/comparison.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comparison.name, schema: ComparisonSchema },
    ]),
  ],
  controllers: [ComparisonsController],
  providers: [ComparisonsService],
  exports: [ComparisonsService],
})
export class ComparisonsModule {}
