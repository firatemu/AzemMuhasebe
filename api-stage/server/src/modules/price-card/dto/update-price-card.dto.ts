import { PartialType } from '@nestjs/swagger';
import { CreatePriceCardDto } from './create-price-card.dto';

export class UpdatePriceCardDto extends PartialType(CreatePriceCardDto) { }
