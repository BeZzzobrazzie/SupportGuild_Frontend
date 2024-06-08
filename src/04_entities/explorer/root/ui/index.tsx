import { Entity } from "../../entity";
import classes from "./classes.module.css";
import { useAppSelector } from "src/05_shared/lib/hooks";

export function Root() {
  const rootChildren = useAppSelector((state) => state.explorer).filter(
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
