import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import routes from "@/routes/matching-router";
import ComplexitySubscriber from "./subscribers/complexity-subscriber";
import healthCheckRouter from "../../../shared/router/healthcheck-router";

class Server {
  private app;
  private port;

  constructor() {
    const port = process.env.SERVER_PORT;
    if (!port) {
      console.log("Missing SERVER_PORT");
      process.exit();
    }

    if (!process.env.MATCHING_TOPIC || !process.env.MATCHING_TOPIC_SUB) {
      console.log("Missing MATCHING_TOPIC or MATCHING_TOPIC_SUB");
      process.exit();
    }

    this.port = port;
    this.app = express();
    this.configMiddleware();
    this.configRouter();
    // this.start();
    this.runOnStart();
  }

  private configMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
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
    // NOTE: Central router if necessary
    this.app.use("/matching", routes);
    this.app.use("/health", healthCheckRouter);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log("listening to port", this.port);
    });
  }

  private runOnStart() {
    console.log("Running pubsub subscriber on server start");
    const complexitySubscriber = new ComplexitySubscriber();
    complexitySubscriber.start();
  }
}

export default Server;
