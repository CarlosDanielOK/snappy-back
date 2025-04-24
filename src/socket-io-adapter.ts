import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: process.env.DOMAIN_FRONT,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      transports: ['websocket'],
    };

    this.logger.log(
      'Configurando servidor de SocketIo con opciones custom de CORS',
      { cors },
    );

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    return super.createIOServer(port, optionsWithCORS);
  }
}
