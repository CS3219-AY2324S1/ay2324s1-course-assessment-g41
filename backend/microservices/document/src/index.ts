import "dotenv/config"
import BroadcastServer from './server'

const documentBroadcastServer = new BroadcastServer()
documentBroadcastServer.start()