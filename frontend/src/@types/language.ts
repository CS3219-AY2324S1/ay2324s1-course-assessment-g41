export interface Language {
  label: string;
  value: string;
}

export type LanguageRequest = Partial<Language>;
export type LanguageResponse = {
  id: string;
  name: string;
};

export type LanguagesResponse = LanguageResponse[];
