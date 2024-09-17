import { ExplorerSmall } from "src/02_widgets/explorer-small";
import classes from "./style.module.css";
import { Templates } from "src/02_widgets/templates";
import { OutputEditor } from "src/02_widgets/output-editor";
import { OutputEditorProvider } from "src/02_widgets/output-editor/lib/output-editor-provider";

export function TemplatesPage() {
  return (
    <div className={classes["template-page"]}>
      <ExplorerSmall />
      <OutputEditorProvider>
        <Templates />
        <OutputEditor />
      </OutputEditorProvider>
    </div>
  );
}
