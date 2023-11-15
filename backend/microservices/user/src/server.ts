import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '@/routes/router';
import cookieParser from "cookie-parser";

class Server {
    private app
    private port

    constructor() {
        const port = process.env.SERVER_PORT
        if (!port) {
            console.log("Missing SERVER_PORT")
            process.exit()
        }

        this.port = port
        this.app = express();
        this.configMiddleware();
        this.configRouter()
    }

    private configMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); 
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
        this.app.use('/', routes);
    }

    public start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port)
        })
    }
}

export default Server;