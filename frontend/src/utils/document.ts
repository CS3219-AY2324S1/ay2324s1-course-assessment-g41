import { Language } from "@/@types/language";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Doc } from "yjs";

const log = (message: string, data: any = {}) => {
  console.log(`[upsertDocumentValue] ${message}`, data);
};

const logError = (message: string, error: any = {}) => {
  console.error(`[upsertDocumentValue Error] ${message}`, error);
};

export const upsertDocumentValue = ({
  sharedKey,
  valueToUpdate,
  document,
}: {
  sharedKey: string;
  valueToUpdate: any;
  document: Doc | null;
}): void => {
  if (!document) {
    logError("upsertDocumentValue - Document is null. Cannot update value.");
    return;
  }

  log(`upsertDocumentValue - Upserting value. Shared Key: ${sharedKey}, Value:`, valueToUpdate);
  const ymap = document.getMap(sharedKey);
  document.transact(() => {
    ymap.set(sharedKey, valueToUpdate);
    log(`upsertDocumentValue - Transaction complete. Updated ${sharedKey} in YMap.`);
  });
};

export const resetTextInDocument = ({
  document,
  defaultText = "",
}: {
  document: Doc | null;
  defaultText?: string;
}) => {
  if (!document) {
    logError("resetTextInDocument - Document is null. Cannot reset text.");
    return;
  }

  log(`resetTextInDocument - Resetting text in document. Default Text: ${defaultText}`);
  const ytext = document.getText("monaco");
  document.transact(() => {
    ytext.delete(0, ytext.length);
    ytext.insert(0, defaultText);
    log("resetTextInDocument - Text reset complete.");
  });
};

export const sendAttemptToDocServer = ({
  attemptId,
  text,
  language,
  questionId,
  provider,
}: {
  attemptId: number;
  text: string;
  language: Language;
  questionId: string | null | undefined;
  provider: HocuspocusProvider | null;
}) => {
  if (!provider) {
    logError("sendAttemptToDocServer - Provider is null. Cannot send attempt.");
    return;
  }

  log(
    `sendAttemptToDocServer - Sending attempt to server. Attempt ID: ${attemptId}, Language: ${language.label}, Question ID: ${questionId}`,
  );
  provider.sendStateless(
    JSON.stringify({
      attemptId,
      language,
      text,
      questionId,
    }),
  );
};
