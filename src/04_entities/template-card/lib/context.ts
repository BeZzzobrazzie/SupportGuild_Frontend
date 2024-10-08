import { LexicalEditor } from "lexical";
import { createContext, useContext } from "react";

type CardEditorContextType = {
  editor: LexicalEditor | null;
  setEditor: (editor: LexicalEditor) => void;
};

export const CardEditorContext = createContext<
CardEditorContextType | undefined
>(undefined);

export function useCardEditor() {
  const context = useContext(CardEditorContext);
  if (!context) {
    throw new Error(
      "useCardEditor must be used within a CardEditorProvider"
    );
  }
  return context;
}
