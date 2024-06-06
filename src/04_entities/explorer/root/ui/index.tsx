import { useSelector } from "react-redux";
import { RootState } from "src/00_app/store";
import { Entity } from "../../entity";
import classes from "./classes.module.css";

export function Root() {
  const rootChildren = useSelector((state: RootState) => state.explorer).filter(
    (item) => item.parent === -1
  );

  return (
    <ul className={classes["root"]}>
      {rootChildren.map((entity) => (
        <Entity key={entity.id} entity={entity} nestingLevel={0} />
      ))}
    </ul>
  );
}
