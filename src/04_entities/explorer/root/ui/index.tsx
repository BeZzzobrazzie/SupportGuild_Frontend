import { useEffect } from "react";
import { Entity } from "../../entity";
import classes from "./classes.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { explorerModel } from "../..";
import { EntityCreator } from "../../entity-creator";
import { explorerSlice, fetchEntities } from "../../model";
// import { useGetEntitiesQuery } from "src/05_shared/api/apiSlice";

export function Root() {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  // const {
  //   data: entities,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetEntitiesQuery();

  useEffect(() => {
    dispatch(fetchEntities());
  }, []);

  const entities = useAppSelector((state) =>
    explorerSlice.selectors.selectEntities(state)
  );
  const isFetchEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFetchEntitiesPending(state)
  );
  console.log(entities);

  const isParentOfCreatedEntity = useAppSelector(
    (state) => state.explorer.entityCreation.parentId === null
  );

  const rootOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        dispatch(
          explorerModel.addEntityCreator({
            parentId: null,
            category: "file",
          })
        );
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        dispatch(
          explorerModel.addEntityCreator({
            parentId: null,
            category: "folder",
          })
        );
      },
    },
  ];

  let content = <></>;

  if (isFetchEntitiesPending) {
    content = <div>Loading...</div>;
  } else if (true) {
    const rootChildren = entities.filter((item) => item.parentId === null);

    content = (
      <ul
        className={classes["root"]}
        onContextMenu={showContextMenu(rootOptions)}
      >
        {isParentOfCreatedEntity && (
          <EntityCreator parentId={null} nestingLevel={0} />
        )}
        {rootChildren.map((entity) => (
          <Entity key={entity.id} entity={entity} nestingLevel={0} />
        ))}
      </ul>
    );
  }
  // else if (isError) {
  //   content = <div>{error.toString()}</div>;
  // }

  return <>{content}</>;
}
