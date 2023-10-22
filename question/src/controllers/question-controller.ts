import { Request, Response } from 'express';
import { Question, Difficulty } from '@/models/question';
import { QuestionService, CreateQuestionReq } from '@/services/question-service'; 


const questionService = new QuestionService();

export async function createQuestion(req: Request, res: Response) {
  try {
    const newQuestion: CreateQuestionReq = req.body;
    await questionService.createQuestion(newQuestion);

    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
}

export async function getQuestionById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const question = await questionService.getQuestionById(id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send();
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
      // get all questions
      difficultiesEnumArray = Object.values(Difficulty).map(d => d as Difficulty)
    }

    const sort: 'asc' | 'desc' | 'nil' = (sorting === 'asc' || sorting === 'desc') ? sorting : 'nil';

    const sortedQuestions = await questionService.getFilteredQuestions(
      difficultiesEnumArray,
      sort
    );

    res.json(sortedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}


export async function updateQuestion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const update: Partial<Question> = req.body;
    const updatedQuestion = await questionService.updateQuestion(id, update);

    if (updatedQuestion) {
      res.json(updatedQuestion);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deleted = await questionService.deleteQuestion(id);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send();
  }
}
