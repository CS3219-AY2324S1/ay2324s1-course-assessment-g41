import { useContext } from "react";
import { CollabContext } from "../../components/collabRoom/CollabRoom";

export const useCollabContext = () => {
  const collabContext = useContext(CollabContext);

  if (collabContext === null) {
    throw new Error("useCollabContext must be used within a CollabContext.Provider");
  }

  return {
    ...collabContext,
  };
};
