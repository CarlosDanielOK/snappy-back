import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Notification,
  NotificationStatus,
} from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const { user_id, content, type, sender_user } = createNotificationDto;

    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException(`El usuario con el id ${user_id} no fue encontrado.`,);

    if (sender_user) {
      const senderFound = await this.usersRepository.findOne({ where: { id: sender_user } });
      if (!senderFound) throw new NotFoundException(`El usuario con el id ${sender_user} no fue encontrado.`,);
    }

    const newNotification = this.notificationRepository.create({
      content,
      type,
      status: NotificationStatus.UNREAD,
      user: { id: user_id },
      user_sender: { id: sender_user }
    });
    try {
      return await this.notificationRepository.save(newNotification);
    } catch (error) {
      throw new BadRequestException(
        'Hubo un error al guardar la notificación',
        error.message,
      );
    }
  }

  async findAll() {
    try {
      const notifications = await this.notificationRepository.find({
        relations: ['user', 'user_sender'],
      });

      const responseObject = notifications.map((notification) => ({
        ...notification,
        user: {
          id: notification.user.id,
        },
      }));
      return responseObject;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todas las notificaciones. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const notifications = await this.notificationRepository.findOne({
        where: { notification_id: id },
        relations: ['user', 'user_sender'],
      });
      if (!notifications) {
        throw new NotFoundException('Notificación no encontrada.');
      }
      const responseObject = {
        ...notifications,
        user: {
          id: notifications.user.id,
        },
      };

      return responseObject;
    } catch {
      throw new InternalServerErrorException(
        'Error inesperado al procesar la notificación.',
      );
    }
  }

  async findByUser(id: string) {
    const userFound = await this.usersRepository.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException(`Usuario con id ${id} no encontrado.`);

    const notifications = await this.notificationRepository.find({
      where: { user: { id: userFound.id } },
      relations: ['user', 'user_sender']
    });

    return notifications;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification | string> {
    try {
      const notifications = await this.notificationRepository.findOne({
        where: { notification_id: id },
      });

      if (!notifications) {
        throw new NotFoundException(`Notificación con id ${id} no encontrada.`);
      }

      Object.assign(notifications, updateNotificationDto);

      return await this.notificationRepository.save(notifications);
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException(
          'Ocurrió un error al actualizar la notificación. Por favor, verifique los datos.',
        );
      }

      throw error;
    }
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notification_id: id },
    });

    if (!notification) throw new NotFoundException('Notificación no encontrada');

    notification.status = NotificationStatus.READ;
    await this.notificationRepository.save(notification);

    return notification;
  }

  async markAllAsRead(userId: string) {
    const userFound = await this.usersRepository.findOne({ where: { id: userId } })
    if (!userFound) throw new NotFoundException('No se encontró al usuario')

    const notifications = await this.notificationRepository.find({
      where: {
        status: NotificationStatus.UNREAD,
        user: { id: userFound.id }
      },
    });

    if (notifications.length === 0) {
      throw new NotFoundException('No hay notificaciones por leer');
    }

    notifications.forEach(notification => {
      notification.status = NotificationStatus.READ;
    });

    await this.notificationRepository.save(notifications);

    return notifications;
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { notification_id: id },
      });
      if (!notification) {
        throw new NotFoundException(
          `La notificación con el id ${id} no fue encontrada.`,
        );
      }
      await this.notificationRepository.remove(notification);
      return { message: `Notificación con id ${id} borrada correctamente.` };
    } catch {
      throw new InternalServerErrorException(
        `Error inesperado al procesar la solicitud.`,
      );
    }
  }
}
