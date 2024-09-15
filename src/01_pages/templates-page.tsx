import { ExplorerSmall } from "src/02_widgets/explorer-small";
import classes from "./style.module.css";
import { Templates } from "src/02_widgets/templates";
import { OutputEditor } from "src/02_widgets/output-editor";
import { useState } from "react";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { OutputEditorProvider } from "src/02_widgets/output-editor/lib/context";

export function TemplatesPage() {
  return (
    <div className={classes["template-page"]}>
      <ExplorerSmall />
      <OutputEditorProvider>
        <Templates />
        {/* <OutputEditor setOutputEditor={setOutputEditor} /> */}
        <OutputEditor />
      </OutputEditorProvider>
    </div>
  );
}
