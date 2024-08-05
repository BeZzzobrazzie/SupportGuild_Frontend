import { useEffect, useState } from "react";
import { useContextMenu } from "mantine-contextmenu";

import classes from "./root.module.css";
import { explorerSlice, fetchExplorerItemsTh } from "../model";
import { explorerItemCategory } from "../api/types";
import { ExplorerItemCreator } from "./item-creator";
import { ExplorerItem } from "./explorer-item";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

export function Root() {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  // console.log(explorerItems);

  useEffect(() => {
    dispatch(fetchExplorerItemsTh());
  }, []);

  const children = useAppSelector((state) =>
    explorerSlice.selectors.selectChildren(state, null)
  );
  const isFetchExplorerItemsPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFetchExplorerItemsPending(state)
  );

  const [isCreator, setIsCreator] = useState(false);
  const [creatorCategory, setCreatorCategory] =
    useState<explorerItemCategory>(null);

  function showCreator() {
    setIsCreator(true);
  }
  function hideCreator() {
    setIsCreator(false);
  }

  const rootOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        setCreatorCategory("file");
        showCreator();
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        setCreatorCategory("folder");
        showCreator();
      },
    },
  ];

  let content = <></>;

  if (isFetchExplorerItemsPending) {
    content = <div>Loading...</div>;
  } else if (children) {
    content = (
      <ul
        className={classes["root"]}
        onContextMenu={showContextMenu(rootOptions)}
      >
        {isCreator && (
          <ExplorerItemCreator
            parentId={null}
            category={creatorCategory}
            nestingLevel={0}
            hideExplorerItemCreator={hideCreator}
          />
        )}
        {children.map((entity) => (
          <ExplorerItem
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
