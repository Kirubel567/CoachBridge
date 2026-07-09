import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TokensService } from '../auth/tokens.service';

// Same HTTP server/port as the REST API (ws://host:4000, path /socket.io).
// Origin is checked per-handshake against CORS_ORIGIN (evaluated at runtime,
// after env is loaded).
@WebSocketGateway({
  cors: {
    origin: (origin, cb) => {
      const allowed = (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',');
      cb(null, !origin || allowed.includes(origin));
    },
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly tokens: TokensService) {}

  /** Authenticate the socket from its handshake and join a per-user room. */
  async handleConnection(client: Socket) {
    try {
      const raw =
        (client.handshake.auth?.token as string | undefined) ??
        client.handshake.headers.authorization?.replace('Bearer ', '');
      if (!raw) throw new Error('missing token');
      const payload = await this.tokens.verifyAccessToken(raw);
      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect(true);
    }
  }

  /** Push an event to every socket a user has open. */
  emitToUser(userId: string, event: string, payload: unknown) {
    this.server?.to(`user:${userId}`).emit(event, payload);
  }

  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { toUserId: string; conversationId: string },
  ) {
    const from = client.data.userId as string | undefined;
    if (!from || !data?.toUserId) return;
    this.emitToUser(data.toUserId, 'typing', {
      conversationId: data.conversationId,
      from,
    });
  }
}
