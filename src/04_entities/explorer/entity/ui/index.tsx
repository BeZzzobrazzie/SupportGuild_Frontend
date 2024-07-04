import {
  IconFile,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import classes from "./classes.module.css";
import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { EntityCreator } from "../../entity-creator";
import { useState } from "react";
import { explorerModel } from "../..";
import { explorerSlice } from "../../model";
import { explorerItemId } from "../../lib/types";

interface EntityProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}
export function Entity({ explorerItemId, nestingLevel }: EntityProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
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
  console.log(explorerItem)

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["entity_indent"]}></div>
    ));

  function handleFolderClick() {
    // if (entity.isOpen) dispatch(explorerModel.closeFolder(entity.id));
    // else dispatch(explorerModel.openFolder(entity.id));
    setIsOpen(!isOpen);
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
              onContextMenu={showContextMenu(folderOptions)}
            >
              {indent}
              {isOpen ? <IconChevronDown /> : <IconChevronRight />}
              {/* <IconFolder /> */}
              {explorerItem.name}
              {explorerItem.isRemoval && (
                <span>deletion is in progress...</span>
              )}
            </div>
            {isOpen && (
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
              onContextMenu={showContextMenu(fileOptions)}
            >
              {indent}
              <IconFile />
              {explorerItem.name}
              {explorerItem.isRemoval && (
                <span>deletion is in progress...</span>
              )}
            </div>
          </li>
        );

        break;
    }
  }

  return <>{content}</>;
}
