import { Language } from "@/@types/language";
import { Question } from "@/@types/models/question";
import { getAttempt, createNewAttempt as serverCreateNewAttempt } from "@/services/history";
import { resetTextInDocument, sendAttemptToDocServer, upsertDocumentValue } from "@/utils/document";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { useGetAllAttempts } from "../history/useGetAllAttempts";
import { useGetDocumentValue } from "../room/useSharedDocument";

// karwi: extract to utils
const log = (message: string, data: any = {}) => {
  console.log(`[useManageAttempt] ${message}`, data);
};

const logError = (message: string, error: any = {}) => {
  console.error(`[useManageAttempt Error] ${message}`, error);
};

const useManageAttempt = ({
  document,
  provider,
  roomName,
}: {
  document: Y.Doc | null;
  provider: HocuspocusProvider | null;
  roomName: string;
}) => {
  // shared language
  const { sharedValue: sharedLanguage }: { sharedValue: Language } = useGetDocumentValue({
    sharedKey: "language",
    document,
    defaultValue: {
      label: "Plain Text",
      value: "plaintext",
    },
  });

  // shared question
  const { sharedValue: sharedQuestion }: { sharedValue: Question } = useGetDocumentValue({
    sharedKey: "question",
    document,
    defaultValue: null,
  });

  // shared current attempt id
  const { sharedValue: sharedAttemptId }: { sharedValue: number } = useGetDocumentValue({
    sharedKey: "attemptId",
    document,
    defaultValue: 1,
  });

  const [currentAttempt, setCurrentAttempt] = useState<{
    attemptId: number;
    question: Question | null;
    language: Language;
  }>({ attemptId: sharedAttemptId, question: sharedQuestion, language: sharedLanguage });
  const { attempts: listOfSavedAttempts } = useGetAllAttempts({ roomName, currentAttempt });

  log("Current Attempt:", currentAttempt);
  log("List of Saved Attempts:", listOfSavedAttempts);

  useEffect(() => {
    if (!document || !provider) {
      log("Document or provider not initiated, skipping effect");
      return;
    }

    // note: server creates a default attempt per room.
    // on initialisation, set current attempt as the first default attempt
    log("Initializing attempt", { attemptId: 1 });
    toggleToAttempt(1);
  }, [document, provider]);

  useEffect(() => {
    // side-effect meant to sync chnages across different clients
    log("useEffect triggered: Setting current attempt to", {
      sharedAttemptId,
      sharedLanguage,
      sharedQuestion,
    });

    setCurrentAttempt({
      attemptId: sharedAttemptId,
      question: sharedQuestion,
      language: sharedLanguage,
    });
  }, [sharedAttemptId, sharedLanguage, sharedQuestion]);

  const createNewAttempt = async () => {
    if (!provider || !document) {
      log("createNewAttempt: Provider and document are not initiated, no attempt to create");

      return;
    }

    const currentAttemptId = document.getMap("attemptId").get("attemptId") as number;
    const language = document.getMap("language").get("language") as Language;
    const text = document.getText("monaco");
    const question = document.getMap("question").get("question") as Question | undefined;

    if (currentAttemptId && currentAttemptId > 0) {
      // write all of previous attempt and send to server
      log("createNewAttempt: Sending stateless message", { currentAttemptId, language });
      sendAttemptToDocServer({
        provider,
        attemptId: currentAttemptId,
        language,
        text: text.toJSON(),
        questionId: question?.id || null,
      });
    }
    // create new attempt
    try {
      log("createNewAttempt: Creating attempt on new attempt");
      const newAttempt = await serverCreateNewAttempt({ roomName });
      console.log("server create attempt", newAttempt);
      upsertDocumentValue({
        sharedKey: "attemptId",
        valueToUpdate: newAttempt.attemptId,
        document,
      });
      upsertDocumentValue({
        sharedKey: "language",
        valueToUpdate: newAttempt.language,
        document,
      });

      upsertDocumentValue({
        sharedKey: "question",
        valueToUpdate: newAttempt.question,
        document,
      });

      resetTextInDocument({ document, defaultText: newAttempt.text });

      setCurrentAttempt({
        attemptId: newAttempt.attemptId,
        question: newAttempt.question as Question | null,
        language: newAttempt.language,
      });
    } catch (err) {
      logError("createAttempt: Error occurred", err);
    }
  };

  const toggleToAttempt = async (nextAttemptId: number) => {
    try {
      log("toggleToAttempt: Attempt ID to toggle", nextAttemptId);
      const toggledAttempt = await getAttempt(nextAttemptId, roomName);
      log("toggleToAttempt: Retrieved attempt", toggledAttempt);

      // change shared values to prev attempt values
      upsertDocumentValue({
        sharedKey: "attemptId",
        valueToUpdate: toggledAttempt.attemptId,
        document,
      });

      upsertDocumentValue({
        sharedKey: "language",
        valueToUpdate: toggledAttempt.language,
        document,
      });

      upsertDocumentValue({
        sharedKey: "question",
        valueToUpdate: toggledAttempt.question,
        document,
      });

      resetTextInDocument({ document, defaultText: toggledAttempt.text });

      // change local state
      setCurrentAttempt({
        attemptId: toggledAttempt.attemptId,
        question: toggledAttempt.question as Question | null,
        language: toggledAttempt.language,
      });
    } catch (err) {
      logError("toggleToAttempt: Error occurred", err);
    }
  };

  const saveAttempt = () => {
    if (!document) return;
    const text = document?.getText("monaco");

    log("saveAttempt: Saving current attempt", {
      attemptId: currentAttempt.attemptId,
      language: currentAttempt.language,
      text: text.toJSON(),
      questionId: currentAttempt.question?.id || null,
    });

    sendAttemptToDocServer({
      provider,
      attemptId: currentAttempt.attemptId,
      language: currentAttempt.language,
      text: text.toJSON(),
      questionId: currentAttempt.question?.id || null,
    });
  };

  return {
    currentAttempt,
    listOfSavedAttempts,
    createNewAttempt,
    toggleToAttempt,
    saveAttempt,
  };
};

export default useManageAttempt;
