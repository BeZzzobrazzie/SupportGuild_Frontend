import { LexicalEditor } from "lexical";
import { createContext, ReactNode, useContext, useState } from "react";

type OutputEditorContextType = {
  editor: LexicalEditor | null;
  setEditor: (editor: LexicalEditor) => void;
};

export const OutputEditorContext = createContext<
  OutputEditorContextType | undefined
>(undefined);

export function useOutputEditor() {
  const context = useContext(OutputEditorContext);
  if (!context) {
    throw new Error(
      "useOutputEditor must be used within a OutputEditorProvider"
    );
  }
  return context;
}

export function OutputEditorProvider({children} : {children: ReactNode}) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);

  return (
    <OutputEditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </OutputEditorContext.Provider>
  );
}
