import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyVehicleDto } from './create-company-vehicle.dto';

export class UpdateCompanyVehicleDto extends PartialType(CreateCompanyVehicleDto) { }
