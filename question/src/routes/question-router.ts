import { Router } from 'express';
import * as QuestionController from '@/controllers/question-controller';
import * as AuthMiddleware from '@/middlewares/auth-middleware';

const router = Router();

// TODO: update for session/middleware
router.use(AuthMiddleware.authJWT);

router.get('/', QuestionController.getFilteredQuestions);

router.post('/', QuestionController.createQuestion);
router.get('/:id', QuestionController.getQuestionById);
router.patch('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);

export default router;