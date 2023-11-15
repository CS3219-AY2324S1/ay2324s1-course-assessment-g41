import { upsertDocumentValue } from "@/utils/document";
import { useEffect, useState } from "react";
import { Doc } from "yjs";

export const useGetDocumentValue = ({
  sharedKey,
  document,
  defaultValue,
}: {
  sharedKey: string;
  document: Doc | null;
  defaultValue: any;
}) => {
  const [val, setVal] = useState(defaultValue);

  useEffect(() => {
    if (!document) return;
    if (document?.getMap(sharedKey).get(sharedKey)) return;

    upsertDocumentValue({
      sharedKey,
      document,
      valueToUpdate: defaultValue,
    });
  }, [document]);

  useEffect(() => {
    if (!document) return;
    const ymap = document.getMap(sharedKey);
    // event handler that subscribes to changes in specified ymap[sharedKey] value
    // and resets states for all who gets
    ymap.observe((e) => {
      if (e?.target?._map.get(sharedKey)?.content.getContent().length === 0) return;
      setVal(e?.target._map.get(sharedKey)?.content.getContent()[0]);
    });
  }, [sharedKey, document, document?.get(sharedKey), val]);

  return {
    sharedValue: val,
  };
};
