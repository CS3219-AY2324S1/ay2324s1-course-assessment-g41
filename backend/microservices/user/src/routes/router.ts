import { Router } from 'express';

import userRouter from '@/routes/user-router'
import authRouter from '@/routes/auth-router'
import * as ResourceController from '@/controllers/resource-controller';
import healthCheckRouter from "../../../../shared/router/healthcheck-router"

const routes = Router();

routes.get('/topics', ResourceController.getTopics)
routes.get('/languages', ResourceController.getLanguages)

routes.use('/user', userRouter);
routes.use('/auth', authRouter);

routes.use('/health', healthCheckRouter);

export default routes;
