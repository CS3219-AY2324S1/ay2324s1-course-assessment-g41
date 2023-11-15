import { QuestionComplexity } from "@/@types/models/question";
import { createContext, useContext, useMemo, ReactNode, useState } from "react";

export interface MatchingContextValue {
  complexity?: QuestionComplexity | number | null | undefined;
  resetComplexity: () => void;
  setComplexity: (complexity: QuestionComplexity) => void;
}

const MatchingContext = createContext<MatchingContextValue>({} as MatchingContextValue);

/**
 * Provider for ProfileContext
 *
 * authProvider can only be provided using context
 * since they are non-serializable
 * @see {@link https://redux-toolkit.js.org/api/serializabilityMiddleware}
 */
export const MatchingProvider = ({ children }: { children: ReactNode }) => {
  const [complexity, setComplexity] = useState<QuestionComplexity | number | undefined>();

  const resetComplexity = () => {
    setComplexity(undefined);
  };

  return (
    <MatchingContext.Provider
      value={{
        complexity,
        resetComplexity,
        setComplexity,
      }}
    >
      {children}
    </MatchingContext.Provider>
  );
};

export const useMatchingContext = () => useContext(MatchingContext);
