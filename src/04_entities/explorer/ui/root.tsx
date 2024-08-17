import { useEffect, useState } from "react";
import { useContextMenu } from "mantine-contextmenu";

import classes from "./root.module.css";
import { explorerSlice } from "../model";
import { explorerItemCategory, explorerItemId } from "../api/types";
import { ExplorerItemCreator } from "./item-creator";
import { ExplorerItem } from "./explorer-item";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useQuery } from "@tanstack/react-query";
import { getExplorerItems } from "../api/explorer-api";
import { useDrop } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";
import { useMoveMutation } from "../lib/use-move-mutation";
import cn from 'classnames/bind';

const cx = cn.bind(classes);

export function Root() {
  const { showContextMenu } = useContextMenu();
  const {
    isPending,
    isError,
    data: explorerItems,
    error,
  } = useQuery(getExplorerItems());
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

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!explorerItems) {
    return <span>Error: no data</span>;
  }

  const children = Object.values(explorerItems.byId).filter(
    (child) => child.parentId === null
  );

  const rootClass = cx('root', {
    'root_drop': isOver
  })

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
  ];

  let content = <></>;

  content = (
    <>
      <ul
        ref={drop}
        className={rootClass}
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
