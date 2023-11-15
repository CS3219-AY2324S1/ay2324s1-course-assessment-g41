import 'dotenv/config'
import Server from '@/server';

const userServer = new Server();
userServer.start();
