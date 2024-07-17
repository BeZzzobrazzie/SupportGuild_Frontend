import { useEffect, useState } from "react";
import { Entity } from "./entity";
import classes from "./root.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { EntityCreator } from "./entity-creator";
import { explorerSlice, fetchEntities } from "../model";
import { explorerItemCategoryType } from "../lib/types";

export function Root() {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  // console.log(explorerItems);

  useEffect(() => {
    dispatch(fetchEntities());
  }, []);

  const children = useAppSelector((state) =>
    explorerSlice.selectors.selectChildren(state, null)
  );
  const isFetchEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFetchEntitiesPending(state)
  );

  const [isEntityCreator, setIsEntityCreator] = useState(false);
  const [categoryEntityCreator, setCategoryEntityCreator] =
    useState<explorerItemCategoryType>(null);

  function showEntityCreator() {
    setIsEntityCreator(true);
  }
  function hideEntityCreator() {
    setIsEntityCreator(false);
  }

  const rootOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        setCategoryEntityCreator("file");
        showEntityCreator();
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        setCategoryEntityCreator("folder");
        showEntityCreator();
      },
    },
  ];

  let content = <></>;

  if (isFetchEntitiesPending) {
    content = <div>Loading...</div>;
  } else if (children) {
    content = (
      <ul
        className={classes["root"]}
        onContextMenu={showContextMenu(rootOptions)}
      >
        {isEntityCreator && (
          <EntityCreator
            parentId={null}
            category={categoryEntityCreator}
            nestingLevel={0}
            hideEntityCreator={hideEntityCreator}
          />
        )}
        {children.map((entity) => (
          <Entity
            key={entity.id}
            explorerItemId={entity.id}
            nestingLevel={0}
            parentIsRemoval={false}
          />
        ))}
      </ul>
    );
  }
  // else if (isError) {
  //   content = <div>{error.toString()}</div>;
  // }

  return <>{content}</>;
}
