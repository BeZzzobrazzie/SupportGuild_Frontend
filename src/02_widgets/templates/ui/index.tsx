import { CommandPanel, ListCards } from "src/04_entities/template-card";
import { AddCard } from "src/04_entities/template-card/ui/add-card";
import classes from "./style.module.css";

export function Templates() {
  return (
    <div className={classes["templates"]}>
      <CommandPanel />
      <ListCards />
    </div>
  );
}
