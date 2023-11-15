import cors from 'cors';
import express from "express";
import expressWebsockets from "express-ws";
import { onUpgradePayload, Server as HocuspocusServer } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import broadcastRouter from './routes/broadcast-router'
import { Redis as ExtensionRedis } from '@hocuspocus/extension-redis'
import Redis from "ioredis";

/**
 * Handles the broadcast logic between multiple clients via Yjs. 
 * 
 * Reference: https://tiptap.dev/hocuspocus/server/configuration
 * The Hocuspocus Server is a websocket backend that integrates Yjs.
 */
class BroadcastServer {
  readonly broadcastWebsocketServer: typeof HocuspocusServer
  readonly port: number
  readonly app: expressWebsockets.Application;

  constructor() {
    const port = process.env.SERVER_PORT
    if (!port) {
      console.log("Missing env varibale SERVER_PORT")
      process.exit()
    }

    if (!process.env.JWT_SECRET || !process.env.ACCESS_COOKIE_KEY || !process.env.REFRESH_COOKIE_KEY) {
      console.log("Missing JWT secret for decryption")
      process.exit()
    }

    if (!process.env.COLLAB_SERVICE_ENDPOINT) {
      console.log("Missing connection to Collab Endpoint - operations involving collab service will not work");
      process.exit();
    }

    if (!process.env.REDIS_DOCUMENT_URL) {
      console.log("Missing REDIS SYNC");
      process.exit();
    }

    if (!process.env.ATTEMPT_TOPIC) {
      console.log("Missing ATTEMPT_TOPIC");
      process.exit();
    }

    this.port = parseInt(port)
    this.broadcastWebsocketServer = this.createAndConfigureWebsocketServer()
    const { app } = expressWebsockets(express());
    this.app = app;
    this.configMiddleware();
    this.configRouter();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Broadcast server is listening on port "${this.port}"!`);
    })
    // this.broadcastWebsocketServer.listen(this.port)
  }

  private configMiddleware() {
    this.app.use(cors({
      origin: [
        "https://peerprep.dev",
        "https://www.peerprep.dev",
        "https://api.peerprep.dev",
        "https://www.api.peerprep.dev:3000",
        "http://localhost:3000"
      ],
      credentials: true,
    }));
  }

  private configRouter() {
    this.app.get("/", (req, res) => {
      // for health check
      res.status(200).send();
    });

    this.app.ws("/document", (websocket, request) => {
      this.broadcastWebsocketServer.handleConnection(websocket, request);
    });
  }

  private createAndConfigureWebsocketServer() {
    return HocuspocusServer.configure({
      name: 'PeerPrep Document Broadcast Server',
      extensions: [
        new Logger(),
        new ExtensionRedis({
          host: "",
          port: 10,
          createClient: () => new Redis(`${process.env.REDIS_DOCUMENT_URL}`)
        })
      ],
      onListen: async (data) => {
        console.log(`Broadcast server is listening on port "${data.port}"!`);
      },
      onAuthenticate: broadcastRouter.onAuthenticate,
      onStoreDocument: async (data) => {
        this.emitEvent(`SAVING_DOCUMENT_${data.documentName}`)
        await broadcastRouter.onStoreDocument(data)
        this.emitEvent(`SAVED_DOCUMENT_${data.documentName}`)
      },
      onStateless: broadcastRouter.onStateless,
      onDisconnect: broadcastRouter.onDisconnect,
    })
  }
  
  private emitEvent(event: string) {
    if (!this.broadcastWebsocketServer.server) return;
    this.broadcastWebsocketServer.server.webSocketServer.emit(event)
  }
}

export default BroadcastServer;
