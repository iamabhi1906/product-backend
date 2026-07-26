import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDto } from './dto/address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(@InjectRepository(Address) private readonly addresses: Repository<Address>) {}

  findAll(userId: string) {
    return this.addresses.find({ where: { userId: Number(userId) }, order: { isDefault: 'DESC', createdAt: 'ASC' } });
  }

  async create(userId: string, dto: AddressDto) {
    return this.addresses.manager.transaction(async (manager) => {
      if (dto.isDefault) await manager.update(Address, { userId: Number(userId) }, { isDefault: false });
      const count = await manager.count(Address, { where: { userId: Number(userId) } });
      return manager.save(Address, manager.create(Address, { ...dto, userId: Number(userId), isDefault: dto.isDefault ?? count === 0 }));
    });
  }

  async update(id: string, userId: string, dto: AddressDto) {
    const address = await this.getOwned(id, userId);
    return this.addresses.manager.transaction(async (manager) => {
      if (dto.isDefault) await manager.update(Address, { userId: Number(userId) }, { isDefault: false });
      return manager.save(Address, Object.assign(address, dto));
    });
  }

  async setDefault(id: string, userId: string) {
    const address = await this.getOwned(id, userId);
    return this.addresses.manager.transaction(async (manager) => {
      await manager.update(Address, { userId: Number(userId) }, { isDefault: false });
      address.isDefault = true;
      return manager.save(address);
    });
  }

  async remove(id: string, userId: string) {
    const address = await this.getOwned(id, userId);
    await this.addresses.remove(address);
  }

  private async getOwned(id: string, userId: string) {
    const address = await this.addresses.findOneBy({ id: Number(id) });
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== Number(userId)) throw new ForbiddenException('Address does not belong to you');
    return address;
  }
}
