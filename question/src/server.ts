import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import router from '@/routes/question-router'

class Server {
    private app
    private port

    constructor() {
        this.port = process.env.SERVER_PORT
        this.app = express();
        this.configMiddleware();
        this.configRouter()
    }

    private configMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); 
        this.app.use(cookieParser()); 

        this.app.use(cors({
            origin: '*',
        }));
    }

    private configRouter() {
        // NOTE: Central router if necessary
        this.app.use('/question', router);
    }

    public start() {
        // TODO: start up config
        this.app.listen(this.port, () => {
            console.log("listening to port", this.port)
        })
    }
}

export default Server;
