import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";
import express from 'express'
import attemptRouter from "@/routes/attempt-router";
import AttemptSubscriber from "@/subscribers/attempt-subscriber";
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

    if (!process.env.MONGO_HISTORY || !process.env.MONGO_DBNAME) {
      console.log("Missing env varibale MONGO or MONGO_DBNAME")
      process.exit()
    }

    if (!process.env.COLLAB_SERVICE_ENDPOINT) {
      console.log("Missing COLLAB_SERVICE_ENDPOINT");
      process.exit();
    }

    if (!process.env.ATTEMPT_TOPIC_SUB) {
      console.log("Missing ATTEMPT_TOPIC_SUB");
      process.exit();
    }

    this.port = port
    this.app = express()
    this.configMiddleware()
    this.configRouter()
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log("Listening to port", this.port)
    })
    const historySubscriber = new AttemptSubscriber();
    historySubscriber.start()
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
    this.app.use('/history', attemptRouter)
    this.app.use('/health', healthCheckRouter)
  }
}

export default Server;