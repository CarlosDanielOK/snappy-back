import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  PaymentMethod,
  PaymentStatus,
  Purchase_Log,
} from './entities/purchase_log.entity';
import { User, userType } from 'src/users/entities/user.entity';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { subscriptionRangeDTO } from './dto/purchases.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase_Log)
    private readonly purchaseRepository: Repository<Purchase_Log>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly nodemailerService: NodemailerService
  ) { }

  async createPendingPurchase(userId: string, amount: number, sessionId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) throw new NotFoundException('El usuario no existe');

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);

    const purchase = this.purchaseRepository.create({
      user,
      amount,
      purchase_date: new Date(),
      expiration_date: expireDate,
      payment_method: PaymentMethod.CARD,
      status: PaymentStatus.PENDING,
      stripe_session_id: sessionId,
    });

    return await this.purchaseRepository.save(purchase);
  }

  async completePurchase(sessionId: string) {
    const purchase = await this.purchaseRepository.findOne({
      where: { stripe_session_id: sessionId, status: PaymentStatus.PENDING },
      relations: ['user'],
    });

    if (!purchase) throw new NotFoundException('Compra no encontrada o ya completada');

    purchase.status = PaymentStatus.COMPLETED;

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);
    purchase.expiration_date = expireDate;

    const user = purchase.user;
    user.user_type = userType.PREMIUM;
    await this.usersRepository.update(user.id, { user_type: userType.PREMIUM });

    const savedPurchase = await this.purchaseRepository.save(purchase);

    const emailSubject = '¡Gracias por tu suscripción Premium!';
    const emailText = `Hola ${user.fullname}, gracias por adquirir el paquete premium.`;
    const emailHtml = `<div style="text-align: center;">
      <h1>¡Ahora eres Premium, ${user.fullname}!</h1>
      Gracias por suscribirte a nuestro paquete premium. Tu suscripción está activa.
      </div>`;

    await this.nodemailerService.sendEmail(
      user.email,
      emailSubject,
      emailText,
      emailHtml
    );

    return savedPurchase;
  }

  async getSubscriptionByUser(userId) {
    const subscriptionFound = await this.purchaseRepository.findOne({
      where: {
        user: { id: userId },
        status: PaymentStatus.COMPLETED
      },
      relations: ['user']
    });
    if (!subscriptionFound) throw new NotFoundException("Subscription not found");

    return subscriptionFound;
  }

  async getSubscriptions() {
    return await this.purchaseRepository.find({ relations: ['user'] });
  }

  async getSubscriptionsRange(subscriptionRange: subscriptionRangeDTO) {
    const { startDate, endDate } = subscriptionRange;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const subscriptions = await this.purchaseRepository.find({
      where: {
        purchase_date: Between(start, end),
        status: PaymentStatus.COMPLETED
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
          username: true,
          fullname: true,
          profile_image: true
        }
      }
    })

    const totalAmount = subscriptions.reduce((total, subscription) => total + subscription.amount, 0)

    return {
      subscriptions,
      totalAmount
    }
  }
}
