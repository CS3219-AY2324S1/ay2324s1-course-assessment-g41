import { Language } from "@/@types/language";
import { upsertDocumentValue } from "@/utils/document";
import { Doc } from "yjs";
import { useGetLanguages } from "../room/useGetLanguages";

const useManageCodingLanguages = ({ document }: { document: Doc | null }) => {
  const { supportedLanguages } = useGetLanguages();

  const handleLanguageChange = (newLanguageValue: Language) => {
    upsertDocumentValue({
      sharedKey: "language",
      valueToUpdate: newLanguageValue,
      document,
    });
  };

  return {
    supportedLanguages,
    handleLanguageChange,
  };
};

export default useManageCodingLanguages;
