import { useEffect } from "react";
import { Entity } from "../../entity";
import classes from "./classes.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { fetchEntities } from "../../model";
import { useContextMenu } from "mantine-contextmenu";
import { explorerModel } from "../..";
import { EntityCreator } from "../../entity-creator";
import { useGetEntitiesQuery } from "../../model/explorerApi";

export function Root() {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  const result = useGetEntitiesQuery();

  // const rootChildren = useAppSelector(
  //   (state) => state.explorer.entities
  // ).filter((item) => item.parentId === null);
  const isParentOfCreatedEntity = useAppSelector(
    (state) => state.explorer.entityCreation.parentId === null
  );

  // const entityStatus = useAppSelector((state) => state.explorer.status);
  // const error = useAppSelector((state) => state.explorer.error);

  // useEffect(() => {
  //   if (entityStatus === "idle") {
  //     dispatch(fetchEntities());
  //   }
  // }, [entityStatus, dispatch]);

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

  if (result.isLoading) {
    console.log("loading root");
    content = <div>Loading...</div>;
  } else if (result.isSuccess) {
    console.log("success root");
    const rootChildren = result.data.filter((item) => item.parentId === null);
    // console.log(rootChildren);

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

  // if (entityStatus === "loading") {
  //   content = <div>Loading...</div>;
  // } else if (entityStatus === "succeeded") {
  //   content = (
  //     <ul
  //       className={classes["root"]}
  //       onContextMenu={showContextMenu(rootOptions)}
  //     >
  //       {isParentOfCreatedEntity && (
  //         <EntityCreator parentId={null} nestingLevel={0} />
  //       )}
  //       {rootChildren != undefined && rootChildren.map((entity) => (
  //         <Entity key={entity.id} entity={entity} nestingLevel={0} />
  //       ))}
  //     </ul>
  //   );
  // } else if (entityStatus === "failed") {
  //   content = <div>{error}</div>;
  // }

  return <>{content}</>;
}
