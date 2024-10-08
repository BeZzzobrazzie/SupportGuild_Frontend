import { CommandPanel, ListCards } from "src/04_entities/template-card";
import classes from "./style.module.css";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppSelector } from "src/05_shared/redux";
import { CardEditorProvider } from "src/04_entities/template-card/lib/card-editor-provider";

export function Templates() {
  const activeCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectActiveCollection(state)
  );
  const isActiveCollection = activeCollection !== null;

  // console.log(
  //   useAppSelector((state) =>
  //     explorerSlice.selectors.selectActiveCollection(state)
  //   )
  // );
  return (
    <div className={classes["templates"]}>
      <CardEditorProvider>
        {isActiveCollection && <CommandPanel />}
        <ListCards />
      </CardEditorProvider>
    </div>
  );
}
