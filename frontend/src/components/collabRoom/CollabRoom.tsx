// pages/CollabRoom.tsx
import React, { useState, createContext, FunctionComponent, useRef, ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import Splitter, { GutterTheme } from "@devbookhq/splitter";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Question } from "@/@types/models/question";
import { User } from "@/@types/user";
import { Language } from "@/@types/language";
import { Attempt } from "@/@types/attempt";
import TabView from "./TabView";
import styles from "./Splitter.module.css";

// karwi: better name?
interface CollabRoomPropsContextValue {
  questionTotalList: Question[];
  languageTotalList: Language[];
  listOfAttempts: Attempt[];
  listOfActiveUsers: User[];
  onDeleteAttempt: (attemptId: number) => void;
  onCloseRoom: () => void;
  onNewAttempt: () => void;
  onCodeChange: (newCodeText: string, attemptId: number) => void;
  onQuestionChange: (newQuestionId: string, attemptId: number) => void;
  onLanguageChange: (newLanguageId: string, attemptId: number) => void;
}

type CollabRoomProps = CollabRoomPropsContextValue & {
  children: ReactNode;
};

interface CurrentAttemptContextValue {
  currentAttempt: Attempt | null;
  setCurrentAttempt: React.Dispatch<React.SetStateAction<Attempt | null>>;
}

type CollabContextValue = CollabRoomPropsContextValue & CurrentAttemptContextValue;

export const CollabContext = createContext<CollabContextValue | null>(null);

const CollabRoom: FunctionComponent<CollabRoomProps> = ({
  questionTotalList,
  languageTotalList,
  listOfAttempts,
  listOfActiveUsers,
  onDeleteAttempt,
  onCloseRoom,
  onNewAttempt,
  onCodeChange,
  onQuestionChange,
  onLanguageChange,
  children,
}) => {
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const splitterSizesRef = useRef<number[]>([50, 50]); // assuming equal initial sizes for simplicity

  const handleResizeFinished = (pairIdx: number, newSizes: number[]) => {
    splitterSizesRef.current = newSizes;
  };

  return (
    <CollabContext.Provider
      value={{
        questionTotalList,
        languageTotalList,
        listOfAttempts,
        listOfActiveUsers,
        onDeleteAttempt,
        onCloseRoom,
        onNewAttempt,
        onCodeChange,
        onQuestionChange,
        onLanguageChange,
        // others
        currentAttempt,
        setCurrentAttempt,
      }}
    >
      <Box>
        <TopBar />
        <Splitter
          gutterTheme={GutterTheme.Light}
          gutterClassName={styles.splitterContainer}
          initialSizes={splitterSizesRef.current}
          onResizeFinished={handleResizeFinished}
        >
          {children}
          <TabView />
        </Splitter>
        <BottomBar />
      </Box>
    </CollabContext.Provider>
  );
};

export default CollabRoom;
