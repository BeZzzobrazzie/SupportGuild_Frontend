import { ExplorerSmall } from "src/02_widgets/explorer-small";
import classes from "./style.module.css";
import { Templates } from "src/02_widgets/templates";
import { OutputEditor } from "src/02_widgets/output-editor";
import { OutputEditorProvider } from "src/02_widgets/output-editor/lib/output-editor-provider";
import { BackupOptions } from "src/02_widgets/backup-options";
import { useEffect } from "react";

export function TemplatesPage() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        // Блокируем Ctrl+Z (или Cmd+Z на Mac)
        event.preventDefault();
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "y" || (event.shiftKey && event.key === "z"))
      ) {
        // Блокируем Ctrl+Y или Ctrl+Shift+Z (или Cmd+Shift+Z на Mac)
        event.preventDefault();
      }
    };

    // Добавляем обработчик события при монтировании компонента
    document.addEventListener("keydown", handleKeyDown);

    // Убираем обработчик события при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={classes["template-page"]}>
      <div className={classes["template-page__left-side"]}>
        <ExplorerSmall />
        <BackupOptions />
      </div>
      <OutputEditorProvider>
        <Templates />
        <OutputEditor />
      </OutputEditorProvider>
    </div>
  );
}
