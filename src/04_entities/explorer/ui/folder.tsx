import { useSuspenseQuery } from "@tanstack/react-query";
import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { getExplorerItems } from "../api/explorer-api";
import { explorerItemCategory, explorerItemId } from "../api/types";
import { useSort } from "../lib/use-sort";
import {
  clickOnFolder,
  explorerSlice,
  selectItem,
  toggleSelectItem,
} from "../model";
import {
  useDeleteItemMutation,
  useDeleteItemsMutation,
  useMoveMutation,
} from "../lib/mutations";
import { DragPreviewImage, useDrop } from "react-dnd";
import { useDropFolder } from "../lib/use-drop-folder";

import classes from "./explorer-item.module.css";
import cn from "classnames/bind";
import { useState } from "react";
import { ExplorerItemCreator } from "./item-creator";
import { useDragItems } from "../lib/use-drag-items";
import { useIsMutatingExplorerItems } from "../lib/use-is-mutating-explorer-items";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { ExplorerItemUpdateInput } from "./item-update-input";
import { Loader } from "@mantine/core";
import { Indent } from "./indent";
import { Collection } from "./collection";

const cx = cn.bind(classes);

interface FolderProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}

export function Folder({ explorerItemId, nestingLevel }: FolderProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  const {
    isPending,
    isError,
    data: explorerItems,
    error,
  } = useSuspenseQuery(getExplorerItems());
  const explorerItem = explorerItems.byId[explorerItemId];
  const children = explorerItems.ids
    .map((id) => explorerItems.byId[id])
    .filter((item) => item.parentId === explorerItem.id);
  useSort(children);

  const isOpen = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFolderOpen(state, explorerItem.id)
  );
  const isSelectedItem = useAppSelector((state) =>
    explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
  );
  const selectedItemsIds = useAppSelector((state) =>
    explorerSlice.selectors.selectSelectedItemsIds(state)
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const moveMutation = useMoveMutation();
  const deleteItemMutation = useDeleteItemMutation(explorerItem);
  const deleteItemsMutation = useDeleteItemsMutation();
  const isMutatingExplorerItems = useIsMutatingExplorerItems();

  const [{ isOver }, drop] = useDropFolder(
    explorerItem,
    explorerItems,
    moveMutation
  );

  const folderClass = cx("folder", {
    ["folder_drop"]: isOver,
    // ["explorer-item_drag"]: isDragging,
  });
  const headerClass = cx("explorer-item__header", {
    ["explorer-item__header_select"]: isSelectedItem,
  });

  const [categoryExplorerItemCreator, setCategoryExplorerItemCreator] =
    useState<explorerItemCategory>(null);
  const isExplorerItemCreator = categoryExplorerItemCreator !== null;
  function hideExplorerItemCreator() {
    setCategoryExplorerItemCreator(null);
  }
  const explorerItemCreator = (
    <ExplorerItemCreator
      parentId={explorerItem.id}
      category={categoryExplorerItemCreator}
      nestingLevel={nestingLevel + 1}
      hideExplorerItemCreator={hideExplorerItemCreator}
    />
  );

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (explorerItem) {
      if (event.ctrlKey) {
        dispatch(toggleSelectItem(explorerItem.id));
      } else {
        dispatch(selectItem(explorerItem.id));
        dispatch(clickOnFolder(explorerItem.id));
      }
    }
  }
  const draggableItems = isSelectedItem ? selectedItemsIds : [explorerItem.id];
  const [{ isDragging }, drag, preview] = useDragItems(draggableItems);

  const dragPreviewImage = (
    <DragPreviewImage connect={preview} src={"src/assets/drag-drop-2.svg"} />
  );

  const options = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        if (!isOpen) dispatch(clickOnFolder(explorerItem.id));
        setCategoryExplorerItemCreator("file");
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        if (!isOpen) dispatch(clickOnFolder(explorerItem.id));
        setCategoryExplorerItemCreator("folder");
      },
    },
    { key: "divider-1" },
    {
      key: "cut",
      onClick: () => console.log("cut"),
      disabled: true,
    },
    {
      key: "copy",
      title: "Copy",
      onClick: () => console.log("copy"),
      disabled: true,
    },
    {
      key: "past",
      title: "Past",
      onClick: () => console.log("past"),
      disabled: true,
    },
    { key: "divider-2" },
    {
      key: "rename",
      onClick: () => {
        console.log("rename");
        setIsUpdating(true);
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        if (isSelectedItem) {
          deleteItemsMutation.mutate();
        } else {
          deleteItemMutation.mutate(explorerItem.id);
        }
      },
    },
  ];
  const loadingOptions = [
    {
      key: "Loading...",
      onClick: () => {},
      disabled: true,
    },
  ];

  const renderChildren = children.map((child) => {
    if (child.category === "folder")
      return (
        <Folder
          key={child.id}
          explorerItemId={child.id}
          nestingLevel={nestingLevel + 1}
        />
      );
    else if (child.category === "file")
      return (
        <Collection
          key={child.id}
          explorerItemId={child.id}
          nestingLevel={nestingLevel + 1}
        />
      );
  });

  return (
    <>
      {dragPreviewImage}
      <li ref={(node) => drag(drop(node))} className={folderClass}>
        <div className={classes["explorer-item__row"]}>
          <Indent nestingLevel={nestingLevel} />
          <div
            className={headerClass}
            onClick={(event) => handleClick(event)}
            onContextMenu={
              isMutatingExplorerItems
                ? showContextMenu(loadingOptions)
                : showContextMenu(options)
            }
          >
            {isOpen ? <IconChevronDown /> : <IconChevronRight />}
            {isUpdating ? (
              <ExplorerItemUpdateInput
                id={explorerItem.id}
                name={explorerItem.name}
                setIsUpdating={setIsUpdating}
              />
            ) : (
              <div className={classes["explorer-item__label"]}>
                {explorerItem.name}
              </div>
            )}
            {isMutatingExplorerItems && <Loader color="yellow" size="xs" />}
          </div>
        </div>

        {isOpen && (
          <ul className={classes["children-list"]}>
            {renderChildren}
            {isExplorerItemCreator && explorerItemCreator}
          </ul>
        )}
      </li>
    </>
  );
}
