import { IsInt, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVehicleDto {
  @ApiPropertyOptional()
  placa?: string;
  @ApiPropertyOptional()
  chassi?: string;
  @ApiPropertyOptional()
  renavam?: string;
  @ApiPropertyOptional()
  modelo?: string;
  @ApiPropertyOptional()
  marca?: string;
  @ApiPropertyOptional({ minimum: 1900 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano?: number;
}
