import { Language } from "./language";
import { Question } from "./models/question";

export interface Attempt {
  attemptId: number; // karwi: string?
  question?: Question | null;
  language: Language;
}
