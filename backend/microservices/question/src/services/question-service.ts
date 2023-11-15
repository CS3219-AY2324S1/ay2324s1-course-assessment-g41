import { MongoDBClient } from '@/clients/mongo';
import { ObjectId } from 'mongodb';
import { Question, Difficulty } from '@/models/question'

// interface QuestionSchema {
//   _id: ObjectId;
//   title: string;
//   description: string;
//   category: string;
//   complexity: Complexity;
// }


export interface CreateQuestionReq {
  title: string;
  description: string;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
}

export class QuestionService {
  private dbClient: MongoDBClient;
  private collectionName = 'questions'

  constructor() {
    this.dbClient = new MongoDBClient();
    this.dbClient.connect()
  }

  async createQuestion(question: CreateQuestionReq): Promise<Question> {
    const insertedQuestion = await this.dbClient.insertOne(this.collectionName, question);

    return insertedQuestion as Question;
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const filter  = { _id: new ObjectId(id) }
    const question = await this.dbClient.findOne(this.collectionName, filter);

    return question as Question;
  }

  async getFilteredQuestions(difficulties: Difficulty[], sorting: 'asc' | 'desc' | 'nil'): Promise<Question[]> {
    const filter = { difficulty: { $in: difficulties } };
    const questions = await this.dbClient.find(this.collectionName, filter) as Question[];
  
    if (sorting === 'asc') {
      questions.sort((a, b) => a.difficulty - b.difficulty);
    } else if (sorting === 'desc') {
      questions.sort((a, b) => b.difficulty - a.difficulty);
    }
  
    return questions as Question[];
  }

  async updateQuestion(id: string, update: Partial<Question>): Promise<Question | null> {
    const filter = { _id: new ObjectId(id) };
    const updatedQuestion = await this.dbClient.updateOne(this.collectionName, filter, update);

    return updatedQuestion as Question;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const filter = { _id: new ObjectId(id) };
    const deleteResult = await this.dbClient.deleteOne(this.collectionName, filter);

    return deleteResult.deletedCount === 1;
  }
}