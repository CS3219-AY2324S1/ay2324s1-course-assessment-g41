import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { BE_API } from "@/utils/api";
import { HOST_API } from "@/config";

export class DocumentService {
  readonly document: Y.Doc | undefined;
  readonly provider: HocuspocusProvider | undefined;
  readonly binding: MonacoBinding | undefined;

  constructor(roomName: string, editor: any) {
    const { document, provider } = this.initWsConnection(roomName);
    this.document = document;
    this.provider = provider;
    const { binding } = this.bindDocumentToMonacoEditor(editor);
    this.binding = binding;
  }

  private initWsConnection(roomName: string) {
    // Initialise yjs
    let yDoc: Y.Doc = new Y.Doc();

    // Connect to peers with WebSocket
    let yProvider: HocuspocusProvider = new HocuspocusProvider({
      url: `${HOST_API.replace("https://", "wss://")}${BE_API.document}`,
      name: roomName, // room name
      document: yDoc,
      token: "true",
    });

    return { document: yDoc, provider: yProvider };
  }

  private shouldAuthRoom() {
    const val = process.env.NEXT_PUBLIC_SHOULD_AUTH_ROOM;
    return val && val === "true" ? val : undefined;
  }

  private bindDocumentToMonacoEditor(editor: any) {
    if (!this.document || !this.provider || typeof window === "undefined") {
      // throw error
      return { binding: undefined };
    }

    const text = this.document.getText("monaco");
    const model = editor.getModel();
    const binding =
      typeof window === "undefined"
        ? undefined
        : new MonacoBinding(text, model, new Set([editor]), this.provider.awareness);
    return { binding };
  }
}
