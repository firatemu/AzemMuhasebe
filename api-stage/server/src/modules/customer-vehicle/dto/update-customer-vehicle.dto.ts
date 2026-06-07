import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerVehicleDto } from './create-customer-vehicle.dto';

export class UpdateCustomerVehicleDto extends PartialType(
  CreateCustomerVehicleDto,
) {}
