import postgresClient from '@/clients/postgres'; 
import { parseError } from '@/services/service-errors'; 
import { Language, Topic } from '@/models/user';

class ResourceService {
  async getAllLanguages(): Promise<Language[]> {
    try {
      const sql = 'SELECT * FROM languages';
      const result = await postgresClient.query<Language>(sql);
      return result.rows;
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error
    }
  }

  async getAllTopics(): Promise<Topic[]> {
    try {
      const sql = 'SELECT * FROM topics';
      const result = await postgresClient.query<Topic>(sql);
      return result.rows;
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error
    }
  }
}

const resourceService = new ResourceService();
export default resourceService;