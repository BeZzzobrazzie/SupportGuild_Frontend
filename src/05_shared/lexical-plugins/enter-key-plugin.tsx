import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, INSERT_LINE_BREAK_COMMAND, KEY_ENTER_COMMAND } from "lexical";
import { useEffect } from "react";


export function EnterKeyPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_LINE_BREAK_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertLineBreak(); // Вставляем перенос строки
          return true;
        }
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        event.preventDefault();
        editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, true);
        return true;
      },
      1
    );
  }, [editor]);

  return null; // Этот компонент не рендерит UI, он просто добавляет логику
}