import { IsInt, Max, Min } from 'class-validator';

// Manual partial to avoid bringing @nestjs/mapped-types for simplicity
export class UpdateVehicleDto {
  placa?: string;
  chassi?: string;
  renavam?: string;
  modelo?: string;
  marca?: string;
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano?: number;
}
