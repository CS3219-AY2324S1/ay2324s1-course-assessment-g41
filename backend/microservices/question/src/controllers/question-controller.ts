import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Question, Difficulty } from '@/models/question';
import { QuestionService, CreateQuestionReq } from '@/services/question-service'; 
import { handleServiceError } from '@/controllers/error-handler';

const questionService = new QuestionService();

export async function createQuestion(req: Request, res: Response) {
  try {
    const newQuestion: CreateQuestionReq = req.body;
    await questionService.createQuestion(newQuestion);

    res.status(StatusCodes.OK).send();
  } catch (error) {
    handleServiceError(error, res)
    res.send();
  }
}

export async function getQuestionById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json("missing id params")
      return
    }

    const question = await questionService.getQuestionById(id);
    if (question) {
      res.json(question);
    } else {
      res.status(StatusCodes.NOT_FOUND).send();
    }
  } catch (error) {
    handleServiceError(error, res)
    res.send();
  }
}

export async function getFilteredQuestions(req: Request, res: Response) {
  try {
    const { difficulties, sorting } = req.query;

    let difficultiesEnumArray: Difficulty[] = [];

    if (difficulties && typeof difficulties === 'string') {
      difficultiesEnumArray = difficulties
        .split(',')
        .map(d => parseInt(d, 10))
        .filter(d => !isNaN(d) && Object.values(Difficulty).includes(d))
        .map(d => d as Difficulty);
    } else {
      difficultiesEnumArray = Object.values(Difficulty).map(d => d as Difficulty)
    }

    const sort: 'asc' | 'desc' | 'nil' = (sorting === 'asc' || sorting === 'desc') ? sorting : 'nil';

    const sortedQuestions = await questionService.getFilteredQuestions(
      difficultiesEnumArray,
      sort
    );

    res.json(sortedQuestions);
  } catch (error) {
    handleServiceError(error, res)
    res.send();
  }
}


export async function updateQuestion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json("missing id params")
      return
    }

    const update: Partial<Question> = req.body;
    const updatedQuestion = await questionService.updateQuestion(id, update);

    if (updatedQuestion) {
      res.json(updatedQuestion);
    } else {
      res.status(StatusCodes.NOT_FOUND);
    }
  } catch (error) {
    handleServiceError(error, res)
    res.send();
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json("missing id params")
      return
    }

    const deleted = await questionService.deleteQuestion(id);

    if (deleted) {
      res.status(StatusCodes.NO_CONTENT).send();
    } else {
      res.status(StatusCodes.OK).send();
    }
  } catch (error) {
    handleServiceError(error, res)
    res.send();
  }
}

export async function healthCheck(req: Request, res: Response) {
  res.status(200).send();
};