import { LexicalEditor } from "lexical";
import { ReactNode, useState } from "react";
import { OutputEditorContext } from "./context";

export function OutputEditorProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);

  return (
    <OutputEditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </OutputEditorContext.Provider>
  );
}
