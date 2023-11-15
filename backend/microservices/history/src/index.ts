import "dotenv/config"
import { Server } from './server'

const historyServer = new Server()
historyServer.start()