import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase_Log } from './entities/purchase_log.entity';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { User } from 'src/users/entities/user.entity';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase_Log, User]),
    ConfigModule
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService, StripeService, NodemailerService],
})
export class PurchasesModule { }
