import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromoDto } from './dto/promo.dto';
import { Promo } from './entities/promo.entity';

@Injectable()
export class PromosService {
  constructor(@InjectRepository(Promo) private readonly promos: Repository<Promo>) {}

  findAll() { return this.promos.find({ order: { createdAt: 'DESC' } }); }

  async create(dto: CreatePromoDto) {
    const code = dto.code.trim().toUpperCase();
    if (await this.promos.existsBy({ code })) throw new ConflictException('Promo code already exists');
    return this.promos.save(this.promos.create({ ...dto, code, expiresAt: new Date(dto.expiresAt) }));
  }

  async validate(code: string) {
    const promo = await this.promos.findOneBy({ code: code.trim().toUpperCase() });
    if (!promo || !promo.isActive || promo.usedTimes >= promo.maxUses || promo.expiresAt <= new Date()) {
      throw new NotFoundException('Promo code is not available');
    }
    return promo;
  }
}
