import { useEffect, useState } from "react";
import { useContextMenu } from "mantine-contextmenu";

import classes from "./root.module.css";
import { explorerSlice } from "../model";
import {
  explorerItem,
  explorerItemCategory,
  explorerItemId,
  explorerItems,
} from "../api/types";
import { ExplorerItemCreator } from "./item-creator";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getExplorerItems } from "../api/explorer-api";
import { useDrop } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";
import cn from "classnames/bind";
import { useSort } from "../lib/use-sort";
import { useMoveMutation, usePasteMutation } from "../lib/mutations";
import { Folder } from "./folder";
import { Collection } from "./collection";

const cx = cn.bind(classes);

export function Root() {
  const { showContextMenu } = useContextMenu();
  const {
    isPending,
    isError,
    data: explorerItems,
    error,
  } = useSuspenseQuery(getExplorerItems());
  console.log('root')
  console.log(explorerItems);

  const [categoryExplorerItemCreator, setCategoryExplorerItemCreator] =
    useState<explorerItemCategory>(null);
  const isExplorerItemCreator = categoryExplorerItemCreator !== null;

  function hideExplorerItemCreator() {
    setCategoryExplorerItemCreator(null);
  }
  const moveMutation = useMoveMutation();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EXPLORER_ITEM,
      canDrop: (item, monitor) => {
        if (monitor.isOver({ shallow: true })) {
          return true;
        } else {
          return false;
        }
      },
      drop: (item: { ids: explorerItemId[] }) => {
        moveMutation.mutate({
          parentId: null,
          ids: item.ids,
        });
        // return item;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    []
  );
  const children = Object.values(explorerItems.byId).filter(
    (child) => child.parentId === null
  );
  useSort(children);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError && error) {
    return <span>Error: {error.message}</span>;
  }

  if (!explorerItems) {
    return <span>Error: no data</span>;
  }

  const rootClass = cx("root", {
    root_drop: isOver,
  });

  const rootOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        setCategoryExplorerItemCreator("file");
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        setCategoryExplorerItemCreator("folder");
      },
    },
    { key: "divider-1" },
    {
      key: "paste",
      title: "Paste",
      onClick: () => console.log("paste"),
      disabled: true,
    },
  ];

  let content = <></>;
  const renderChildren = children.map((child) => {
    if (child.category === "folder")
      return (
        <Folder key={child.id} explorerItemId={child.id} nestingLevel={0} />
      );
    else if (child.category === "file")
      return (
        <Collection key={child.id} explorerItemId={child.id} nestingLevel={0} />
      );
  });

  content = (
    <>
      <ul
        ref={drop}
        className={rootClass}
        onContextMenu={showContextMenu(rootOptions)}
      >
        {renderChildren}
        {isExplorerItemCreator && (
          <ExplorerItemCreator
            parentId={null}
            category={categoryExplorerItemCreator}
            nestingLevel={0}
            hideExplorerItemCreator={hideExplorerItemCreator}
          />
        )}
      </ul>
    </>
  );

  return <>{content}</>;
}
