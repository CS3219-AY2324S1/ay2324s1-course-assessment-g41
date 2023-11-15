// pages/CollabRoom.tsx
import React, { createContext, FunctionComponent, useRef, ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import Splitter, { GutterTheme } from "@devbookhq/splitter";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Question } from "@/@types/models/question";
import { User } from "@/@types/user";
import { Attempt } from "@/@types/attempt";
import TabView from "./TabView";
import styles from "./Splitter.module.css";
import { Language } from "@/@types/language";

interface CollabRoomLanguage {
  label: string;
  value: string;
}

interface CollabRoomPropsContextValue {
  questionTotalList: Question[];
  languageTotalList: CollabRoomLanguage[];
  listOfAttempts: Attempt[];
  listOfActiveUsers: User[];
  currentAttempt: Attempt;
  onSaveAttempt: () => void;
  onCloseRoom: () => void;
  onNewAttempt: () => void;
  onQuestionChange: (newQuestionId: string, attemptId: number) => void;
  onLanguageChange: (newLanguageValue: Language) => void;
  onAttemptChange: (newAttemptId: number) => void;
}

type CollabRoomProps = CollabRoomPropsContextValue & {
  children: ReactNode;
};

type CollabContextValue = CollabRoomPropsContextValue;
export const CollabContext = createContext<CollabContextValue | null>(null);

// karwi: check that listOfActiveUsers.len <= 2
const CollabRoom: FunctionComponent<CollabRoomProps> = ({
  questionTotalList,
  languageTotalList,
  listOfAttempts,
  listOfActiveUsers,
  currentAttempt,
  onSaveAttempt,
  onCloseRoom,
  onNewAttempt,
  onQuestionChange,
  onLanguageChange,
  onAttemptChange,
  children,
}) => {
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
        currentAttempt,
        onSaveAttempt,
        onCloseRoom,
        onNewAttempt,
        onQuestionChange,
        onLanguageChange,
        onAttemptChange,
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
