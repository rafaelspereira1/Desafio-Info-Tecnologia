import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Min,
  Max,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, {
    message: 'placa inválida (padrão Mercosul)',
  })
  placa!: string;

  @IsString()
  @Length(17, 17, { message: 'chassi deve ter 17 caracteres' })
  chassi!: string;

  @IsString()
  @Length(9, 11)
  renavam!: string;

  @IsString()
  @IsNotEmpty()
  modelo!: string;

  @IsString()
  @IsNotEmpty()
  marca!: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano!: number;
}
