import "dotenv/config"
import { Server } from './server'

const collaborationServer = new Server()
collaborationServer.start()