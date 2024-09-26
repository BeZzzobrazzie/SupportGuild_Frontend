import { CommandPanel, ListCards } from "src/04_entities/template-card";
import classes from "./style.module.css";
import { explorerSlice } from "src/04_entities/explorer/model";
import { useAppSelector } from "src/05_shared/redux";

export function Templates() {
  const isActiveCollection =
    useAppSelector((state) =>
      explorerSlice.selectors.selectActiveCollection(state)
    ) !== null;

  return (
    <div className={classes["templates"]}>
      {isActiveCollection && <CommandPanel />}
      <ListCards />
    </div>
  );
}
