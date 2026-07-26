import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Promo } from './entities/promo.entity';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';

@Module({ imports: [AuthModule, TypeOrmModule.forFeature([Promo])], controllers: [PromosController], providers: [PromosService], exports: [PromosService] })
export class PromosModule {}
