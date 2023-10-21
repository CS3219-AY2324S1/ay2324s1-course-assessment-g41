"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const matchingSubscriber_1 = require("./matchingSubscriber");
class Server {
    constructor() {
        const port = process.env.SERVER_PORT;
        if (!port) {
            console.log("Missing SERVER_PORT");
            process.exit();
        }
        this.port = port;
        this.app = (0, express_1.default)();
        this.configRouter();
        // this.start();
        this.runOnStart();
    }
    configRouter() {
        // NOTE: Central router if necessary
        this.app.use("/", router_1.default);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log("listening to port cb", this.port);
        });
    }
    runOnStart() {
        console.log("Running pubsub ---- test haiya ==== oicb subscriber on server start");
        console.log("haiya wtf---=========");
        (0, matchingSubscriber_1.processMatching)();
    }
}
exports.default = Server;
