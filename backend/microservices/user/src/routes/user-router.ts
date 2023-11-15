import { Router } from 'express';
import * as UserController from '@/controllers/user-controller';
// import * as AuthMiddleware from '@/middlewares/auth-middleware';
import { authJWT } from "../../../../shared/middleware/auth-middleware";

const userRouter = Router();

// userRouter.use(AuthMiddleware.authJWT);
userRouter.use(authJWT);

// NOTE: No need to expose creating, should be done in registration steps?
userRouter.get('/topics', UserController.readCurrentTopics);
userRouter.post('/topics', UserController.updateTopics);
userRouter.delete('/topics', UserController.deleteTopics);

userRouter.get('/:id', UserController.getUserById);
userRouter.get('/', UserController.getCurrentUser);
userRouter.patch('/', UserController.updateUser);
userRouter.delete('/', UserController.deleteUser);



export default userRouter;