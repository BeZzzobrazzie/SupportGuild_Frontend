import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import {
  clickOnCollection,
  copyItemsIds,
  explorerSlice,
  resetActiveCollection,
  selectItem,
  toggleSelectItem,
} from "../model";
import { explorerItemId } from "../api/types";
import { useState } from "react";
import { useDeleteItemsMutation } from "../lib/mutations";
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
import cn from "classnames/bind";
import { copyItemsIdsThunk } from "../model/copy-items-ids";
import { useTranslation } from "react-i18next";

const cx = cn.bind(classes);

interface CollectionProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}

export function Collection({ explorerItemId, nestingLevel }: CollectionProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

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
  const idsItemsToDelete = isSelectedItem ? selectedItemsIds : [explorerItemId];
  const deleteItemsMutation = useDeleteItemsMutation(explorerItemId);
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
      title: t("explorer.cut"),
      onClick: () => console.log("cut"),
      disabled: true,
    },
    {
      key: "copy",
      title: t("explorer.copy"),
      onClick: () => {
        console.log("copy");
        dispatch(copyItemsIdsThunk(explorerItemId));
      },
    },
    { key: "divider-1" },
    {
      key: "rename",
      title: t("explorer.rename"),
      onClick: () => {
        console.log("rename");
        setIsUpdating(true);
      },
    },
    {
      key: "share",
      title: t("explorer.share"),
      onClick: () => {
        console.log("share");
      },
      disabled: true,
    },
    { key: "divider-2" },
    {
      key: "delete",
      title: t("explorer.delete"),
      color: "red",
      onClick: () => {
        console.log("delete");
        idsItemsToDelete.map((id) => dispatch(resetActiveCollection(id))); // it's wrong decision. need to refactor
        deleteItemsMutation.mutate();
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

  const headerClass = cx("explorer-item__header", {
    ["explorer-item__header_select"]: isSelectedItem,
    ["explorer-item__header_active"]: isActiveCollection,
  });

  return (
    <>
      {dragPreviewImage}
      <li ref={drag}>
        <div className={classes["explorer-item__row"]}>
          <Indent nestingLevel={nestingLevel} />

          <div
            className={headerClass}
            onContextMenu={
              isMutatingExplorerItems
                ? showContextMenu(loadingOptions)
                : showContextMenu(options)
            }
            onClick={handleClick}
          >
            <IconFile />
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
      </li>
    </>
  );
}
