import { useEffect } from "react";
import { Entity } from "../../entity";
import classes from "./classes.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { fetchEntities } from "../../model";

export function Root() {
  const dispatch = useAppDispatch();
  const rootChildren = useAppSelector(
    (state) => state.explorer.entities
  ).filter((item) => true);
  console.log(rootChildren);

  const entityStatus = useAppSelector((state) => state.explorer.status);
  const error = useAppSelector((state) => state.explorer.error);

  useEffect(() => {
    if (entityStatus === "idle") {
      dispatch(fetchEntities());
    }
  }, [entityStatus, dispatch]);

  let content = <></>;

  if (entityStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (entityStatus === "succeeded") {
    content = (
      <ul className={classes["root"]}>
        {rootChildren.map((entity) => (
          <Entity key={entity.id} entity={entity} nestingLevel={0} />
        ))}
      </ul>
    );
  } else if (entityStatus === "failed") {
    content = <div>{error}</div>;
  }

  return <>{content}</>;
}
