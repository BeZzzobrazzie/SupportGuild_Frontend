import { useSuspenseQuery } from "@tanstack/react-query";
import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { getExplorerItems } from "../api/explorer-api";
import {
  explorerItemCategory,
  explorerItemId,
  explorerItems,
} from "../api/types";
import { useSort } from "../lib/use-sort";
import {
  clearSelection,
  clickOnFolder,
  copyItemsIds,
  deleteFolder,
  explorerSlice,
  selectItem,
  toggleSelectItem,
} from "../model";
import {
  useDeleteItemsMutation,
  useMoveMutation,
  usePasteMutation,
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
import { getAllChildren } from "../lib/get-all-children";
import { copyItemsIdsThunk } from "../model/copy-items-ids";
import { useTranslation } from "react-i18next";

const cx = cn.bind(classes);

interface FolderProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}

export function Folder({ explorerItemId, nestingLevel }: FolderProps) {
  const { showContextMenu } = useContextMenu();
  const { t, i18n } = useTranslation();
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
  const deleteItemsMutation = useDeleteItemsMutation(explorerItemId);
  const pasteMutation = usePasteMutation();
  const isMutatingExplorerItems = useIsMutatingExplorerItems();

  if (deleteItemsMutation.isSuccess) {
    if (isSelectedItem) {
      selectedItemsIds.forEach((id) => dispatch(deleteFolder(id)));
      dispatch(clearSelection());
    } else {
      dispatch(deleteFolder(explorerItemId));
    }
  }

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
      title: t("explorer.newCollection"),
      onClick: () => {
        console.log("new file");
        if (!isOpen) dispatch(clickOnFolder(explorerItem.id));
        setCategoryExplorerItemCreator("file");
      },
    },
    {
      key: "new folder",
      title: t("explorer.newFolder"),
      onClick: () => {
        console.log("new folder");
        if (!isOpen) dispatch(clickOnFolder(explorerItem.id));
        setCategoryExplorerItemCreator("folder");
      },
    },
    { key: "divider-1" },
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
    {
      key: "paste",
      title: t("explorer.paste"),
      onClick: () => {
        console.log("paste");
        pasteMutation.mutate(explorerItemId);
      },
    },
    { key: "divider-2" },
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
    { key: "divider-3" },
    {
      key: "delete",
      title: t("explorer.delete"),
      color: "red",
      onClick: () => {
        console.log("delete");
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
