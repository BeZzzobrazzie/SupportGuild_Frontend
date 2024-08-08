import {
  IconFile,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { useContextMenu } from "mantine-contextmenu";
import { Loader } from "@mantine/core";
import { useState } from "react";

import classes from "./explorer-item.module.css";
import { ExplorerItemUpdateInput } from "./item-update-input";

import { ExplorerItemCreator } from "./item-creator";
import {
  closeFolder,
  explorerSlice,
  openFolder,
  removeExplorerItemsTh,
  removeExplorerItemTh,
  selectItem,
  toggleSelectItem,
} from "../model";
import { selectedCollectionThunk } from "../model/selected-collection";

import {
  explorerItemCategory,
  explorerItemId,
} from "src/04_entities/explorer/api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

interface ExplorerItemProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
  parentIsRemoval: boolean;
}
export function ExplorerItem({
  explorerItemId,
  nestingLevel,
  parentIsRemoval,
}: ExplorerItemProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  // console.log(explorerItem)

  const isFetchExplorerItemsPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFetchExplorerItemsPending(state)
  );
  const explorerItem = useAppSelector((state) =>
    explorerSlice.selectors.selectExplorerItem(state, explorerItemId)
  );
  const children = useAppSelector((state) =>
    explorerSlice.selectors.selectChildren(state, explorerItemId)
  );
  const isActiveCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectIsActiveCollection(state, explorerItemId)
  );
  const isSelectedItem = useAppSelector((state) =>
    explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
  );

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["explorer-item_indent"]}></div>
    ));

  function handleFolderClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (explorerItem) {
      if (event.ctrlKey) {
        dispatch(toggleSelectItem(explorerItem.id));
      } else {
        dispatch(selectItem(explorerItem.id));
        if (explorerItem.isOpen) dispatch(closeFolder(explorerItem.id));
        else dispatch(openFolder(explorerItem.id));
      }
    }
  }
  function handleCollectionClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (explorerItem) {
      if (event.ctrlKey) {
        dispatch(toggleSelectItem(explorerItem.id));
      } else {
        dispatch(selectItem(explorerItem.id));
        dispatch(selectedCollectionThunk(explorerItem.id));
      }
    }
  }

  const [isUpdating, setIsUpdating] = useState(false);

  const [isExplorerItemCreator, setIsExplorerItemCreator] = useState(false);
  const [categoryExplorerItemCreator, setCategoryExplorerItemCreator] =
    useState<explorerItemCategory>(null);

  function showExplorerItemCreator() {
    setIsExplorerItemCreator(true);
  }
  function hideExplorerItemCreator() {
    setIsExplorerItemCreator(false);
  }

  const fileOptions = [
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
          dispatch(removeExplorerItemsTh());
        } else {
          dispatch(removeExplorerItemTh(explorerItemId));
        }
      },
      disabled: explorerItem?.isRemoval,
    },
  ];
  const folderOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        if (explorerItem) {
          if (!explorerItem.isOpen) {
            dispatch(openFolder(explorerItem.id));
          }
        }

        setCategoryExplorerItemCreator("file");
        showExplorerItemCreator();
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        if (explorerItem) {
          if (!explorerItem.isOpen) {
            dispatch(openFolder(explorerItem.id));
          }
        }

        setCategoryExplorerItemCreator("folder");
        showExplorerItemCreator();
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
          dispatch(removeExplorerItemsTh());
        } else {
          dispatch(removeExplorerItemTh(explorerItemId));
        }
      },
      disabled: explorerItem?.isRemoval,
    },
  ];

  let content = <></>;

  if (isFetchExplorerItemsPending) {
    content = <div>Loading...</div>;
  } else if (explorerItem) {
    switch (explorerItem.category) {
      case "folder":
        content = (
          <li>
            <div
              className={classes["explorer-item_header"]}
              onClick={(event) => handleFolderClick(event)}
              onContextMenu={
                isUpdating
                  ? (event) => event.stopPropagation()
                  : explorerItem.isRemoval ||
                    parentIsRemoval ||
                    explorerItem.isUpdatePending
                  ? showContextMenu([])
                  : showContextMenu(folderOptions)
              }
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
              {indent}
              {explorerItem.isOpen ? <IconChevronDown /> : <IconChevronRight />}
              {/* <IconFolder /> */}
              {isUpdating ? (
                <ExplorerItemUpdateInput
                  id={explorerItem.id}
                  name={explorerItem.name}
                  setIsUpdating={setIsUpdating}
                />
              ) : (
                explorerItem.name
              )}
              {(explorerItem.isRemoval ||
                parentIsRemoval ||
                explorerItem.isUpdatePending) && (
                <Loader color="yellow" size="xs" />
              )}
            </div>
            {explorerItem.isOpen && (
              <>
                <ul className={classes["children-list"]}>
                  {isExplorerItemCreator && (
                    <ExplorerItemCreator
                      parentId={explorerItem.id}
                      category={categoryExplorerItemCreator}
                      nestingLevel={nestingLevel + 1}
                      hideExplorerItemCreator={hideExplorerItemCreator}
                    />
                  )}
                  {children.map((child) => (
                    <ExplorerItem
                      key={child.id}
                      explorerItemId={child.id}
                      nestingLevel={nestingLevel + 1}
                      parentIsRemoval={
                        parentIsRemoval || explorerItem.isRemoval
                      }
                    />
                  ))}
                </ul>
              </>
            )}
          </li>
        );
        break;
      case "file":
        content = (
          <li>
            <div
              className={classes["explorer-item_header"]}
              onClick={(event) => handleCollectionClick(event)}
              onContextMenu={
                isUpdating
                  ? (event) => event.stopPropagation()
                  : explorerItem.isRemoval ||
                    parentIsRemoval ||
                    explorerItem.isUpdatePending
                  ? showContextMenu([])
                  : showContextMenu(fileOptions)
              }
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
              {indent}
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
              {(explorerItem.isRemoval ||
                parentIsRemoval ||
                explorerItem.isUpdatePending) && (
                <Loader color="yellow" size="xs" />
              )}
            </div>
          </li>
        );
        break;
    }
  }

  return <>{content}</>;
}
