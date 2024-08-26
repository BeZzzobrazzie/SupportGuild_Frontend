import { ExplorerSmall } from "src/02_widgets/explorer-small";
import classes from "./style.module.css";
import { Templates } from "src/02_widgets/templates";
import { OutputEditor } from "src/02_widgets/output-editor";

export function TemplatesPage() {
  return (
    <div className={classes["template-page"]}>
      <ExplorerSmall />
      <Templates />
      <OutputEditor />
    </div>
  );
}
