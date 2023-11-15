"use client";

import React, { useEffect } from "react";
import { Editor } from "@monaco-editor/react";

import { Cursor } from "../../components/editor";
import { Stack, useColorMode } from "@chakra-ui/react";
import { codeEditorOptions, themifyCodeEditor } from "@/utils/codeEditor";
import { useCollabContext } from "@/hooks/contexts/useCollabContext";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

interface Props {
  onEditorMount: (editor: any) => void;
  provider: HocuspocusProvider | null;
  document: Y.Doc | null;
}

/**
 * Reference: https://liveblocks.io/examples/collaborative-code-editor/nextjs-yjs-monaco
 */
export const CodeEditor: React.FC<Props> = ({ onEditorMount, provider }) => {
  const { currentAttempt } = useCollabContext();
  const language = currentAttempt?.language;
  const { colorMode } = useColorMode();

  useEffect(() => {
    return () => {
      provider?.disconnect();
    };
  }, []);

  return (
    <Stack>
      {provider ? <Cursor yProvider={provider} /> : null}
      <Editor
        height="60vh"
        onMount={onEditorMount}
        language={language ? language.value : "plaintext"}
        options={codeEditorOptions}
        theme={themifyCodeEditor(colorMode)}
      />
    </Stack>
  );
};
