import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import {
  clickOnCollection,
  explorerSlice,
  selectItem,
  toggleSelectItem,
} from "../model";
import { explorerItemId } from "../api/types";
import { useState } from "react";
import {
  useDeleteItemMutation,
  useDeleteItemsMutation,
} from "../lib/mutations";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getExplorerItems } from "../api/explorer-api";
import { DragPreviewImage } from "react-dnd";
import { useDragItems } from "../lib/use-drag-items";
import classes from "./explorer-item.module.css";
import { useIsMutatingExplorerItems } from "../lib/use-is-mutating-explorer-items";
import { Indent } from "./indent";
import { IconFile } from "@tabler/icons-react";
import { ExplorerItemUpdateInput } from "./item-update-input";
import { Loader } from "@mantine/core";

interface CollectionProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}

export function Collection({ explorerItemId, nestingLevel }: CollectionProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  const {
    isPending,
    isError,
    data: explorerItems,
    error,
  } = useSuspenseQuery(getExplorerItems());
  const explorerItem = explorerItems.byId[explorerItemId];

  const isActiveCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectIsActiveCollection(state, explorerItemId)
  );
  const isSelectedItem = useAppSelector((state) =>
    explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
  );
  const selectedItemsIds = useAppSelector((state) =>
    explorerSlice.selectors.selectSelectedItemsIds(state)
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const deleteItemMutation = useDeleteItemMutation(explorerItem);
  const deleteItemsMutation = useDeleteItemsMutation();
  const isMutatingExplorerItems = useIsMutatingExplorerItems();

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (event.ctrlKey) {
      dispatch(toggleSelectItem(explorerItemId));
    } else {
      dispatch(selectItem(explorerItemId));
      dispatch(clickOnCollection(explorerItemId));
    }
  }

  const draggableItems = isSelectedItem ? selectedItemsIds : [explorerItem.id];
  const [{ isDragging }, drag, preview] = useDragItems(draggableItems);
  const dragPreviewImage = (
    <DragPreviewImage connect={preview} src={"src/assets/drag-drop-2.svg"} />
  );

  const options = [
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
    { key: "divider-1" },
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

  // const style = isDragging ? classes["explorer-item_drag"] : "";

  return (
    <>
      {dragPreviewImage}
      <li
        ref={drag}
        // className={style}
      >
        <div
          className={classes["explorer-item_header"]}
          onContextMenu={
            isMutatingExplorerItems
              ? showContextMenu(loadingOptions)
              : showContextMenu(options)
          }
          onClick={handleClick}
        >
          <div
            className={
              isActiveCollection
                ? classes["explorer-item__active"]
                : classes["explorer-item__inactive"]
            }
          ></div>
          <div
            className={
              isSelectedItem
                ? classes["explorer-item__select"]
                : classes["explorer-item__unselect"]
            }
          ></div>
          <Indent nestingLevel={nestingLevel} />
          <IconFile />
          {isUpdating ? (
            <ExplorerItemUpdateInput
              id={explorerItem.id}
              name={explorerItem.name}
              setIsUpdating={setIsUpdating}
            />
          ) : (
            explorerItem.name
          )}
          {isMutatingExplorerItems && <Loader color="yellow" size="xs" />}
        </div>
      </li>
    </>
  );
}
