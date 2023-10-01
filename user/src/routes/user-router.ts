import { Router } from 'express';
import * as UserController from '@/controllers/user-controller';
import * as AuthMiddleware from '@/middlewares/auth-middleware';

const userRouter = Router();

userRouter.use(AuthMiddleware.authJWT);

// NOTE: No need to expose creating, should be done in registration steps?
// userRouter.post('/', UserController.createUser);
userRouter.get('/:id', UserController.getUserById);
userRouter.get('/', UserController.getCurrentUser);
userRouter.patch('/', UserController.updateUser);
userRouter.delete('/', UserController.deleteUser);

export default userRouter;