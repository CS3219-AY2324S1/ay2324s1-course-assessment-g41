import { Router } from 'express';
import * as QuestionController from '@/controllers/question-controller';
import { authJWT } from "../../../../shared/middleware/auth-middleware"
import * as AuthorizationMiddleware from '@/middlewares/authorization-middleware';

const router = Router();

router.use(authJWT)

router.get('/', QuestionController.getFilteredQuestions);

router.post('/', AuthorizationMiddleware.authQuestion, QuestionController.createQuestion);
router.get('/:id', QuestionController.getQuestionById);
router.patch('/:id', AuthorizationMiddleware.authQuestion, QuestionController.updateQuestion);
router.delete('/:id', AuthorizationMiddleware.authQuestion, QuestionController.deleteQuestion);

export default router;