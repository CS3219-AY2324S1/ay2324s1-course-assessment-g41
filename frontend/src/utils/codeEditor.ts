export const themifyCodeEditor = (colorMode: string) => {
  switch (colorMode) {
    case "light":
      return "light";
    case "dark":
      return "vs-dark";
    default:
      return colorMode;
  }
};

export const codeEditorOptions: any = {
  autoIndent: "full",
  contextmenu: true,
  fontFamily: "monospace",
  fontSize: 13,
  lineHeight: 24,
  hideCursorInOverviewRuler: true,
  matchBrackets: "always",
  minimap: {
    enabled: false,
  },
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 4,
  },
  selectOnLineNumbers: false,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: "line",
  automaticLayout: true,
};
