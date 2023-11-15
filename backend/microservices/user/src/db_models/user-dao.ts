export interface UserDao {
    id: string;
    email: string;
    image: string;
    name?: string;
    preferred_language?: string;
    preferred_difficulty?: number;
}