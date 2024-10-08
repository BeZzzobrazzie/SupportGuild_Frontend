import { LexicalEditor } from "lexical";
import { ReactNode, useState } from "react";
import { CardEditorContext } from "./context";

export function CardEditorProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);

  return (
    <CardEditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </CardEditorContext.Provider>
  );
}
