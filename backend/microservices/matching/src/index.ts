import "dotenv/config";
import Server from "@/server";

const matchingServer = new Server();
matchingServer.start();
