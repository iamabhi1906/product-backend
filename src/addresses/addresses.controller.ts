import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { AddressesService } from './addresses.service';
import { AddressDto } from './dto/address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addresses: AddressesService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) { return this.addresses.findAll(request.user.sub); }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: AddressDto) { return this.addresses.create(request.user.sub, dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Req() request: AuthenticatedRequest, @Body() dto: AddressDto) { return this.addresses.update(id, request.user.sub, dto); }

  @Patch(':id/default')
  setDefault(@Param('id') id: string, @Req() request: AuthenticatedRequest) { return this.addresses.setDefault(id, request.user.sub); }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) { await this.addresses.remove(id, request.user.sub); return { message: 'Address deleted' }; }
}
