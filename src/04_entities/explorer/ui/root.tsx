import { useEffect, useState } from "react";
import { useContextMenu } from "mantine-contextmenu";

import classes from "./root.module.css";
import { explorerSlice } from "../model";
import { explorerItemCategory } from "../api/types";
import { ExplorerItemCreator } from "./item-creator";
import { ExplorerItem } from "./explorer-item";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useQuery } from "@tanstack/react-query";
import { getExplorerItems } from "../api/explorer-api";

export function Root() {
  const { showContextMenu } = useContextMenu();
  const { isPending, isError, data: explorerItems, error } = useQuery(getExplorerItems());
  console.log(explorerItems);

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!explorerItems) {
    return <span>Error: no data</span>
  }

  const children = Object.values(explorerItems.byId).filter(
    (child) => child.parentId === null
  );

  const rootOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
      },
    },
  ];

  let content = <></>;


  content = (
    <>
      <ul
      className={classes["root"]}
      onContextMenu={showContextMenu(rootOptions)}
    >
      {/* {isCreator && (
        <ExplorerItemCreator
          parentId={null}
          category={creatorCategory}
          nestingLevel={0}
          hideExplorerItemCreator={hideCreator}
        />
      )} */}
      {children.map((entity) => (
        <ExplorerItem
          key={entity.id}
          explorerItemId={entity.id}
          nestingLevel={0}
        />
      ))}
    </ul>
    </>
  );

  return <>{content}</>;
}
