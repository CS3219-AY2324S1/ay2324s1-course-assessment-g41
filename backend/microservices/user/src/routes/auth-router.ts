import { Router } from 'express';
import * as AuthController from '@/controllers/auth-controller';

const authRouter = Router();

authRouter.get('/google', AuthController.googleAuth);
authRouter.post('/refresh', AuthController.refresh);
authRouter.get('/googleRedirect', AuthController.googleRedirect);
authRouter.get('/checkAuth', AuthController.checkAuth);
authRouter.get('/logout', AuthController.logout);

export default authRouter;