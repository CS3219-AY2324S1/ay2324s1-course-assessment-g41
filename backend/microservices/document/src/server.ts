import { Server as HocuspocusServer } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import broadcastRouter from './routes/broadcast-router'

/**
 * Handles the broadcast logic between multiple clients via Yjs. 
 * 
 * Reference: https://tiptap.dev/hocuspocus/server/configuration
 * The Hocuspocus Server is a websocket backend that integrates Yjs.
 */
class BroadcastServer {
  readonly broadcastWebsocketServer: typeof HocuspocusServer
  readonly port: number

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
      console.log("Missing connection to Collab Endpoint - operations involving collab service will not work")
    }
    this.port = parseInt(port)
    this.broadcastWebsocketServer = this.createAndConfigureWebsocketServer()
  }

  start() {
    this.broadcastWebsocketServer.listen(this.port)
  }

  private createAndConfigureWebsocketServer() {
    return HocuspocusServer.configure({
      name: 'PeerPrep Document Broadcast Server',
      extensions: [
        new Logger(),
        // TODO: include Redis extension for scalability
      ],
      onListen: async (data) => {
        console.log(`Broadcast server is listening on port "${data.port}"!`);
      },
      // onStoreDocument: async (data) => {
      //   this.emitEvent(`SAVING_DOCUMENT_${data.documentName}`)
      //   await broadcastRouter.onStoreDocument(data)
      //   this.emitEvent(`SAVED_DOCUMENT_${data.documentName}`)
      // },
      onAuthenticate: broadcastRouter.onAuthenticate,
      // onChange: broadcastRouter.onChange,
    })
  }
  
  private emitEvent(event: string) {
    if (!this.broadcastWebsocketServer.server) return;
    this.broadcastWebsocketServer.server.webSocketServer.emit(event)
  }
}

export default BroadcastServer;