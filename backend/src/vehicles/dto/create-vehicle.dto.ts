import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'ABC1D23',
    description: 'Placa do veículo (padrão Mercosul)',
  })
  @IsString()
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, {
    message: 'placa inválida (padrão Mercosul)',
  })
  placa!: string;

  @ApiProperty({ example: '12345678901234567' })
  @IsString()
  @Length(17, 17, { message: 'chassi deve ter 17 caracteres' })
  chassi!: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @Length(9, 11)
  renavam!: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  modelo!: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  marca!: string;

  @ApiProperty({ example: 2024, minimum: 1900 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano!: number;
}
