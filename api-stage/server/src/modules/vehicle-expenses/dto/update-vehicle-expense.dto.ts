import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleExpenseDto } from './create-vehicle-expense.dto';

export class UpdateVehicleExpenseDto extends PartialType(CreateVehicleExpenseDto) { }
