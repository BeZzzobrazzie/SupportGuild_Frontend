import { ExplorerSmall } from "src/02_widgets/explorer-small";
import classes from "./style.module.css";
import { Templates } from "src/02_widgets/templates";

export function TemplatesPage() {
  return (
    <div className={classes["template-page"]}>
      <ExplorerSmall />
      <Templates />
    </div>
  );
}
