import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { socketAuthMiddleware } from './middlewares/auth-middleware';
import healthCheckRouter from '../../../shared/router/healthcheck-router';
import Redis from 'ioredis';
import { createAdapter } from 'socket.io-redis';

// karwi: refactor into layers
class ServerApp {
  private app: express.Application;
  private httpServer: any;
  private io: SocketIOServer;
  private port: number | string;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: [
          'https://peerprep.dev',
          'https://www.peerprep.dev',
          'https://api.peerprep.dev',
          'https://www.api.peerprep.dev:3000',
          'http://localhost:3000',
        ],
        credentials: true,
      },
      path: '/videostreaming/socket.io', // Set custom path here
    });
    this.port = process.env.SERVER_PORT || 3000;
    this.configMiddleware();
    this.configSocket();
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' }));
    this.app.use(
      cors({
        origin: [
          'https://peerprep.dev',
          'https://www.peerprep.dev',
          'https://api.peerprep.dev',
          'https://www.api.peerprep.dev:3000',
          'http://localhost:3000',
        ],
        credentials: true,
      })
    );
    this.app.use('/health', healthCheckRouter);
  }

  // karwi: room authentication
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d
  // karwi: ensure no duplicate user
  // see: https://chat.openai.com/c/66fbe369-61be-4d2a-a91f-d486ecca9e8d

  private configSocket() {
    console.log(`Server: process.env.REDIS_URL: ${process.env.REDIS_URL}`);

    const pubClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379'
    );
    const subClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379'
    );

    // Create the Redis adapter using ioredis clients
    const redisAdapter = createAdapter({ pubClient, subClient });

    const printRedisURL = (client: Redis) => {
      const options = client.options;
      const host = options.host;
      const port = options.port;
      const url = `redis://${host}:${port}`;

      console.log(`Connected to Redis at URL: ${url}`);
    };

    // Use the function to print the URLs
    pubClient.on('connect', () => {
      printRedisURL(pubClient);
    });

    subClient.on('connect', () => {
      printRedisURL(subClient);
    });

    // Listen for when the connection is ready to use
    pubClient.on('ready', () => {
      console.log('Redis Publisher Ready');
    });

    subClient.on('ready', () => {
      console.log('Redis Subscriber Ready');
    });

    // Handle connection errors
    pubClient.on('error', (err) => {
      console.error('Redis Publisher Error:', err);
    });

    subClient.on('error', (err) => {
      console.error('Redis Subscriber Error:', err);
    });

    // Handle disconnection
    pubClient.on('end', () => {
      console.log('Redis Publisher Disconnected');
    });

    subClient.on('end', () => {
      console.log('Redis Subscriber Disconnected');
    });

    // Attach the adapter to your Socket.IO server
    this.io.adapter(redisAdapter);

    // this.io.use(socketAuthMiddleware);

    this.io.on('connection', async (socket) => {
      console.log(`Connected client with ID: ${socket.id}`);
      const roomId = socket.handshake.query.roomId as string;

      if (roomId) {
        // Fetch sockets in the room
        this.io
          .in(roomId)
          .fetchSockets()
          .then((sockets) => {
            // karwi: undo check
            if (true) {
              console.log(`Client ${socket.id} joining room: ${roomId}`);
              socket.join(roomId);
              // Register event listeners inside the then block
              socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
                // Inform other clients in the room about the disconnection
                socket
                  .to(roomId)
                  .emit('peerDisconnected', { peerId: socket.id });
                console.log(`Client ${socket.id} left room: ${roomId}`);
              });
              socket.on('callUser', (data) => {
                console.log(`Broadcasting call signal in room: ${data.roomId}`);
                socket.to(data.roomId).emit('callUser', {
                  signal: data.signalData,
                  name: data.name,
                });
              });
              socket.on('answerCall', (data) => {
                console.log(
                  `Broadcasting answer signal in room: ${data.roomId}`
                );
                socket.to(data.roomId).emit('callAccepted', data.signal);
              });
              socket.on('streamStopped', (data) => {
                console.log(
                  `Received 'streamStopped' event in room ${data.roomId}`
                );
                socket.to(data.roomId).emit('streamStopped');
              });
            } else {
              console.log(
                `Room ${roomId} is full. Client ${socket.id} cannot join.`
              );
              socket.emit('roomFull', roomId);
            }
          })
          .catch((error) => {
            console.error(`Error fetching sockets for room ${roomId}:`, error);
          });
      } else {
        console.warn(`Socket ${socket.id} is not in room ${roomId}`);
      }
    });
  }

  public start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default ServerApp;
