// components/CodeEditor.tsx
import React from "react";
import { Editor } from "@monaco-editor/react";
import { useColorMode } from "@chakra-ui/react";
import { codeEditorOptions, themifyCodeEditor } from "@/utils/codeEditor";
import { Language } from "@/@types/language";

const CodeEditor = ({ text, language }: { text: string; language: Language }) => {
  const { colorMode } = useColorMode();
  const options = {
    ...codeEditorOptions,
    readOnly: true,
  };

  return (
    <Editor
      height="60vh"
      onMount={() => {}}
      defaultValue={text}
      language={language ? language.value : "plaintext"}
      options={options}
      theme={themifyCodeEditor(colorMode)}
    />
  );
};

export default CodeEditor;
