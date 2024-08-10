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
  const { data: explorerItems } = useQuery(getExplorerItems());
  console.log(explorerItems);

  if (!explorerItems) {
    return <></>;
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


  if (false) {
    content = <div>Loading...</div>;
  } else if (true) {
    content = (
      <>
        {/* <ul
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
      </ul> */}
      </>
    );
  }

  return <>{content}</>;
}
