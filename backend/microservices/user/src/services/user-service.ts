import postgresClient from '@/clients/postgres'; 
import { User, Role, Topic, Difficulty } from '@/models/user'
import { UserDao } from '@/db_models/user-dao'
import * as error from '@/services/service-errors';
import { parseError } from '@/services/service-errors'; 

class UserService {
  async create(email: string, image: string): Promise<User> {
    try {
        const query =
          'INSERT INTO users (name, email, image) VALUES ($1, $2, $3) RETURNING *;';

        const result = await postgresClient.query<UserDao>(query, [
          email,
          email,
          image,
        ]);

        const dbUser = result.rows[0]

        const user: User = {
          id: dbUser.id,
          email: dbUser.email,
          image: dbUser.image,
          name: dbUser.name,
          preferred_language: dbUser.preferred_language,
          preferred_difficulty: dbUser.preferred_difficulty,
          preferred_topics: [],
          roles: [],  
        }
        
        return user
    } catch (error) {
        if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async read(userId: string): Promise<User | null> {
    try {
        const query = `
            SELECT *
            FROM users
            WHERE users.id = $1
        `;

        const userResult = await postgresClient.query<UserDao>(query, [userId]);

        if (!userResult.rows || userResult.rows.length === 0) {
            return null;
        }

        return this.fetchUserDetails(userResult.rows[0]);
    } catch (error) {
        if (error instanceof Error) {
            throw parseError(error);
        }
        throw error;
    }
  }

  async readByEmail(email: string): Promise<User | null> {
    try {
        const query = `
            SELECT *
            FROM users
            WHERE users.email = $1
        `;

        const userResult = await postgresClient.query<UserDao>(query, [email]);

        if (!userResult.rows || userResult.rows.length === 0) {
            return null;
        }

        return this.fetchUserDetails(userResult.rows[0]);
    } catch (error) {
        if (error instanceof Error) {
            throw parseError(error);
        }
        throw error;
    }
  }

  async readMulti(userIds: string[]): Promise<User[]> {
    try {
      const users: User[] = [];
  
      for (const userId of userIds) {
        const user = await this.read(userId);
        if (user) {
          users.push(user);
        }
      }
  
      return users;
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async update(userId: string, fieldsToUpdate: Partial<UserDao>): Promise<User | null> {
    try {
      const query = `
        UPDATE users
        SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          image = COALESCE($3, image),
          preferred_language = COALESCE($4, preferred_language),
          preferred_difficulty = COALESCE($5, preferred_difficulty)
        WHERE id = $6
        RETURNING *;
      `;

      let preferred_difficulty = null
      if (fieldsToUpdate.preferred_difficulty !== undefined && fieldsToUpdate.preferred_difficulty !== null && fieldsToUpdate.preferred_difficulty in Difficulty) {
        preferred_difficulty = fieldsToUpdate.preferred_difficulty
      }

      const { rows: updatedRows } = await postgresClient.query(query, [
        fieldsToUpdate.name ?? null,
        fieldsToUpdate.email ?? null,
        fieldsToUpdate.image ?? null,
        fieldsToUpdate.preferred_language ?? null,
        preferred_difficulty,
        userId,
      ]);

      if (updatedRows.length > 0) {
        const updatedUser = updatedRows[0] as User;
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.log(error)

      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await postgresClient.query(query, [userId]);
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async readTopics(userId: string): Promise<Topic[]> {
    try {
      const query = `
        SELECT topics.id, topics.name, topics.slug, topics.description
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
      `;
      const result = await postgresClient.query<Topic>(query, [userId]);

      return result.rows;
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async addTopics(userId: string, topicSlugs: string[]): Promise<void> {
    try {
      if (topicSlugs.length > 0) {
        const topicIds = await this.getTopicIdsBySlugs(topicSlugs);

        if (topicIds.length != topicSlugs.length) {
          throw new error.BadRequestError("Invalid topic slugs")
        }

        const query = `
          INSERT INTO user_topic (user_id, topic_id)
          VALUES 
            ${topicIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
        `;
        await postgresClient.query(query, [userId, ...topicIds]);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async updateTopics(userId: string, topicIds: string[]): Promise<void> {
    let begunTransaction = false
    try {
        await postgresClient.query('BEGIN');
        begunTransaction = true

        const deleteQuery = `
            DELETE FROM user_topic WHERE user_id = $1
        `;
        await postgresClient.query(deleteQuery, [userId]);

        if (topicIds.length > 0) {
            const insertQuery = `
                INSERT INTO user_topic (user_id, topic_id)
                VALUES 
                ${topicIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
            `;
            await postgresClient.query(insertQuery, [userId, ...topicIds]);
        }

        await postgresClient.query('COMMIT');
    } catch (error) {
        if (begunTransaction) {
          await postgresClient.query('ROLLBACK');
        }
        if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
}


  async deleteTopics(userId: string, topicSlugs: string[]): Promise<void> {
    try {
      if (topicSlugs.length > 0) {
        const topicIds = await this.getTopicIdsBySlugs(topicSlugs);

        if (topicIds.length != topicSlugs.length) {
          throw new error.BadRequestError("Invalid topic slugs")
        }

        const query = `
          DELETE FROM user_topic
          WHERE user_id = $1 AND topic_id IN (${topicIds.map((_, i) => `$${i + 2}`).join(', ')})
        `;
        await postgresClient.query(query, [userId, ...topicIds]);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async getTopicIdsBySlugs(slugs: string[]): Promise<string[]> {
    try {
      const query = `
        SELECT id
        FROM topics
        WHERE slug IN (${slugs.map((_, i) => `$${i + 1}`).join(', ')})
      `;
      
      const result = await postgresClient.query<{ id: string }>(query, slugs);

      return result.rows.map((row) => row.id);
    } catch (error) {
      if (error instanceof Error) {
        throw parseError(error);
      }

      throw error;
    }
  }

  async fetchTopicsForUser(userId: string): Promise<Topic[]> {
    const topicsQuery = `
        SELECT topics.*
        FROM user_topic
        JOIN topics ON user_topic.topic_id = topics.id
        WHERE user_topic.user_id = $1
    `;

    const topicsResult = await postgresClient.query<Topic>(topicsQuery, [userId]);
    return topicsResult.rows || [];
  }

  async fetchRolesForUser(userId: string): Promise<Role[]> {
      const rolesQuery = `
          SELECT roles.*
          FROM user_role
          JOIN roles ON user_role.role_id = roles.id
          WHERE user_role.user_id = $1
      `;

      const rolesResult = await postgresClient.query<Role>(rolesQuery, [userId]);
      return rolesResult.rows || [];
  }

  async fetchRoleNamessForUser(userId: string): Promise<string[]> {
    const rolesQuery = `
        SELECT roles.name
        FROM user_role
        JOIN roles ON user_role.role_id = roles.id
        WHERE user_role.user_id = $1
    `;

    const rolesResult = await postgresClient.query<{name: string}>(rolesQuery, [userId]);
    return rolesResult.rows.map(row => row.name) || [];
  }

  createUserFromDao(dbUser: UserDao): User {
    return {
        id: dbUser.id,
        email: dbUser.email,
        image: dbUser.image,
        name: dbUser.name,
        preferred_language: dbUser.preferred_language,
        preferred_difficulty: dbUser.preferred_difficulty,
        preferred_topics: [],
        roles: [],  
    };
  }

  async fetchUserDetails(dbUser: UserDao): Promise<User> {
      const user: User = {
        id: dbUser.id,
        email: dbUser.email,
        image: dbUser.image,
        name: dbUser.name,
        preferred_language: dbUser.preferred_language,
        preferred_difficulty: dbUser.preferred_difficulty,
        preferred_topics: [],
        roles: [],  
      }

      user.preferred_topics = await this.fetchTopicsForUser(user.id);
      user.roles = await this.fetchRoleNamessForUser(user.id);
      return user;
  }
}

const userService = new UserService();

export default userService;

