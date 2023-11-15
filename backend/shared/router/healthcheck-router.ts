import { Router } from 'express';
import { healthCheck } from "../middleware/healthcheck-middleware"

const healthCheckRouter = Router();

healthCheckRouter.get('/', healthCheck);

export default healthCheckRouter;
