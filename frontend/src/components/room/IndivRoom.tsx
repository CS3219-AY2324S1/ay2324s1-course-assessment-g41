"use client";
// pages/CollabRoom.tsx
import React, { useRef } from "react";
import { Box, Card, Heading } from "@chakra-ui/react";
import Splitter, { GutterTheme } from "@devbookhq/splitter";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Question } from "@/@types/models/question";
import TabView from "./TabView";
import styles from "./Splitter.module.css";
import { Language } from "@/@types/language";
import SimpleCodeEditor from "../editor/simple-code-editor";

const IndividualRoom = ({
  attempt,
}: {
  attempt: {
    question: Question | null;
    language: Language;
    text: string;
    roomName: string;
  };
}) => {
  const splitterSizesRef = useRef<number[]>([50, 50]); // assuming equal initial sizes for simplicity
  const handleResizeFinished = (pairIdx: number, newSizes: number[]) => {
    splitterSizesRef.current = newSizes;
  };

  return (
    <Box>
      <TopBar attempt={attempt} />
      <Splitter
        gutterTheme={GutterTheme.Light}
        gutterClassName={styles.splitterContainer}
        initialSizes={splitterSizesRef.current}
        onResizeFinished={handleResizeFinished}
      >
        <Card mb={{ base: "0px", "2xl": "20px" }} height="60vh" p={5} overflow="scroll">
          <Heading size="md" mb="20px">
            Your Saved Code
          </Heading>
          <SimpleCodeEditor text={attempt.text} language={attempt.language} />
        </Card>
        <TabView question={attempt.question} />
      </Splitter>
      <BottomBar />
    </Box>
  );
};

export default IndividualRoom;
