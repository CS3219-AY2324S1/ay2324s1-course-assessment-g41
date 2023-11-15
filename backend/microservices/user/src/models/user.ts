export interface User {
    id: string;
    email: string;
    image: string;
    name?: string;
    preferred_language?: string;
    preferred_difficulty?: Difficulty;
    preferred_topics: Topic[];
    roles: string[]
}

export enum Difficulty {
    Easy = 0,
    Medium,
    Hard,
}

export interface Language {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Topic {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Role {
    id: string;
    name: string;
    can_write_question: boolean;
}

export default User;