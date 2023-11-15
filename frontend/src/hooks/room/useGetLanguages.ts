import { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";

export interface MonacoLanguage {
  label: string;
  value: string;
}

export const useGetLanguages = () => {
  const monaco = useMonaco();
  const [supportedLanguages, setSupportedLanguages] = useState<MonacoLanguage[]>([]);

  useEffect(() => {
    if (!monaco) return;
    setSupportedLanguages(
      monaco.languages.getLanguages().map((lang) => ({
        label: lang.aliases && lang.aliases.length > 0 ? lang.aliases[0] : lang.id,
        value: lang.id,
      })),
    );
  }, [monaco]);

  return {
    supportedLanguages,
  };
};
