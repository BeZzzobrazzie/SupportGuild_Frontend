import { ExplorerSmall } from "src/02_widgets/explorer-small";
import classes from "./style.module.css";
import { Templates } from "src/02_widgets/templates";
import { OutputEditor } from "src/02_widgets/output-editor";
import { OutputEditorProvider } from "src/02_widgets/output-editor/lib/output-editor-provider";
import { BackupOptions } from "src/02_widgets/backup-options";
import { useEffect } from "react";
import { Navbar } from "src/02_widgets/navbar";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { templateCardsSlice } from "src/04_entities/template-card/model";
import { explorerSlice } from "src/04_entities/explorer/model";

export function TemplatesPage() {
  const dispatch = useAppDispatch();
  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isSearchMode = mode === "search";
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
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "f" || event.key === "F" || event.code === "KeyF")
      ) {
        event.preventDefault();
        if (activeCollection !== null) {
          dispatch(templateCardsSlice.actions.searchModeOn());
          dispatch(templateCardsSlice.actions.changeSearchArea("current"));
        }
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        (event.key === "f" || event.key === "F" || event.code === "KeyF")
      ) {
        event.preventDefault();
        console.log("if");
        if (activeCollection !== null) {
          console.log("if2");
          dispatch(templateCardsSlice.actions.searchModeOn());
          dispatch(templateCardsSlice.actions.changeSearchArea("all"));
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        if (isSearchMode) {
          dispatch(templateCardsSlice.actions.searchModeOff());
        }
      }
    };

    // Добавляем обработчик события при монтировании компонента
    document.addEventListener("keydown", handleKeyDown);

    // Убираем обработчик события при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCollection, dispatch, isSearchMode]);

  return (
    <div className={classes["template-page"]}>
      <Navbar />
      <div className={classes["template-page__left-side"]}>
        <ExplorerSmall />
      </div>
      <OutputEditorProvider>
        <Templates />
        <OutputEditor />
      </OutputEditorProvider>
    </div>
  );
}
