import {
  IconFile,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import classes from "./classes.module.css";
import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { EntityCreator } from "../../entity-creator";
import { explorerModel } from "../..";
import { explorerSlice } from "../../model";
import { explorerItemId } from "../../lib/types";
import { Loader } from "@mantine/core";

interface EntityProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
  parentIsRemoval: boolean;
}
export function Entity({
  explorerItemId,
  nestingLevel,
  parentIsRemoval,
}: EntityProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  const isParentOfCreatedEntity = useAppSelector(
    (state) => state.explorer.entityCreation.parentId === explorerItemId
  );
  const isFetchEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFetchEntitiesPending(state)
  );
  const isRemoveItemPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsRemoveItemPending(state)
  );
  const explorerItem = useAppSelector((state) =>
    explorerSlice.selectors.selectExplorerItem(state, explorerItemId)
  );
  // console.log(explorerItem)

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["entity_indent"]}></div>
    ));

  function handleFolderClick() {
    if (explorerItem) {
      if (explorerItem.isOpen)
        dispatch(explorerModel.closeFolder(explorerItem.id));
      else dispatch(explorerModel.openFolder(explorerItem.id));
    }
  }

  const children = useAppSelector((state) =>
    explorerSlice.selectors.selectChildren(state, explorerItemId)
  );

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
        // explorerModel.unitRenamingStarted(unit);
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        dispatch(explorerModel.removeEntity(explorerItemId));
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
            dispatch(explorerModel.openFolder(explorerItem.id));
          }
        }
        dispatch(
          explorerModel.addEntityCreator({
            parentId: explorerItemId,
            category: "file",
          })
        );
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        if (explorerItem) {
          if (!explorerItem.isOpen) {
            dispatch(explorerModel.openFolder(explorerItem.id));
          }
        }
        dispatch(
          explorerModel.addEntityCreator({
            parentId: explorerItemId,
            category: "folder",
          })
        );
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
        // explorerModel.unitRenamingStarted(unit);
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        dispatch(explorerModel.removeEntity(explorerItemId));
      },
      disabled: explorerItem?.isRemoval,
    },
  ];

  let content = <></>;

  if (isFetchEntitiesPending) {
    content = <div>Loading...</div>;
  } else if (explorerItem) {
    switch (explorerItem.category) {
      case "folder":
        content = (
          <li>
            <div
              className={classes["entity_header"]}
              onClick={handleFolderClick}
              onContextMenu={
                explorerItem.isRemoval || parentIsRemoval
                  ? showContextMenu([])
                  : showContextMenu(folderOptions)
              }
            >
              {indent}
              {explorerItem.isOpen ? <IconChevronDown /> : <IconChevronRight />}
              {/* <IconFolder /> */}
              {explorerItem.name}
              {(explorerItem.isRemoval || parentIsRemoval) && (
                <Loader color="yellow" size="xs" />
              )}
            </div>
            {explorerItem.isOpen && (
              <>
                <ul className={classes["children-list"]}>
                  {isParentOfCreatedEntity && (
                    <EntityCreator
                      parentId={explorerItem.id}
                      nestingLevel={nestingLevel + 1}
                    />
                  )}
                  {children.map((child) => (
                    <Entity
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
              className={classes["entity_header"]}
              onContextMenu={
                explorerItem.isRemoval || parentIsRemoval
                  ? showContextMenu([])
                  : showContextMenu(fileOptions)
              }
            >
              {indent}
              <IconFile />
              {explorerItem.name}
              {(explorerItem.isRemoval || parentIsRemoval) && (
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
