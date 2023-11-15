import { useEffect, useState } from "react";
import { DocumentService } from "@/services/document";
import { useToast } from "@chakra-ui/react";
import MatchingService from "@/services/matching";

/**
 * Hook that binds the document to the editor and provides the shared document
 * provider that syncs data changes across the document.
 * @param roomName the unique roomName that the document is to be local to.
 */
export const useDocumentProvider = ({ roomName }: { roomName: string }) => {
  const [editor, setEditor] = useState<any>(null);
  const [documentService, setDocumentService] = useState<DocumentService | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!editor) {
      return;
    }

    // once editor is mounted, initialise the room service to bind editor to websocket broadcast
    const docService = new DocumentService(roomName, editor);
    if (docService && docService.provider) {
      console.log("listen to auth event");
      docService.provider.on("authenticationFailed", () => {
        console.log("fail to authenticate");
        toast({
          title: "OOPS! You are not authorized to enter this room.",
          description:
            "Are you sure you're at the right room? All changes to this document will not be broadcasted or saved.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });

      docService.provider.on("authenticated", () => {
        toast({
          title: `Welcome to room ${roomName}.`,
          description: "All changes to this document is automatically saved. Start collaborating!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      });
    }
    setDocumentService(docService);

    return () => {
      documentService?.provider?.disconnect();
      MatchingService.removeMatchingPair();
    };
  }, [editor]);

  const handleEditorMount = (editor: any) => {
    setEditor(editor);
  };

  return {
    handleEditorMount,
    provider: documentService && documentService.provider ? documentService.provider : null,
    document: documentService && documentService.document ? documentService.document : null,
    binding: documentService && documentService.binding ? documentService.binding : null,
  };
};
