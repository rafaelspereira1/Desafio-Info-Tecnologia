import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Get()
  @ApiOkResponse({ description: 'Lista de veículos retornada com sucesso' })
  list() {
    return this.service.list();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Veículo encontrado' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Veículo criado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou duplicados' })
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Veículo atualizado' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Veículo removido' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
