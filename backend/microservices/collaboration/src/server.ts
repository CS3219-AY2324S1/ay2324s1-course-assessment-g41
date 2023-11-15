import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";
import express from 'express'
import roomRouter from './routes/room-router';
import healthCheckRouter from "../../../shared/router/healthcheck-router";

export class Server {
  private app
  private port
  
  constructor() {
    const port = process.env.SERVER_PORT
    if (!port) {
      console.log("Missing env varibale SERVER_PORT")
      process.exit()
    }

    if (!process.env.POSTGRES_COLLAB) {
      console.log("Missing env variable, POSTGRES_COLLAB for database")
      process.exit()
    }

    if (!process.env.JWT_SECRET || !process.env.ACCESS_COOKIE_KEY || !process.env.REFRESH_COOKIE_KEY) {
      console.log("Missing JWT secret for decryption")
      process.exit()
    }

    this.port = port
    const app = express()
    this.app = app
    this.configMiddleware()
    this.configRouter()
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log("Listening to port", this.port)
    })
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
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
    this.app.use('/collaboration/room', roomRouter)
    this.app.use('/health', healthCheckRouter)
  }
}

export default Server;