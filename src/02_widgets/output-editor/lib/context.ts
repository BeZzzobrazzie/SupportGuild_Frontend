import { createContext } from "react";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";


export const EditorContext = createContext<BaseEditor & ReactEditor | null>(null)