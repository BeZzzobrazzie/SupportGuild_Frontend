import { IconFolder, IconFile } from "@tabler/icons-react";
import { entityType } from "../../lib/types";
import { RootState } from "src/00_app/store";
import classes from "./classes.module.css";
import { explorerModel } from "../..";
import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { EntityCreator } from "../../entity-creator";
import { useState } from "react";

interface EntityProps {
  entity: entityType;
  nestingLevel: number;
}
export function Entity({ entity, nestingLevel }: EntityProps) {
  const dispatch = useAppDispatch();
  const children = useAppSelector((state) =>
    state.explorer.entities.filter((item) => item.parentId === entity.id)
  );
  const isParentOfCreatedEntity = useAppSelector(
    (state) => state.explorer.entityCreation.parentId === entity.id
  );

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["entity_indent"]}></div>
    ));

  function handleFolderClick() {
    if (entity.isOpen) dispatch(explorerModel.closeFolder(entity.id));
    else dispatch(explorerModel.openFolder(entity.id));
  }

  const { showContextMenu } = useContextMenu();

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
        dispatch(explorerModel.deleteEntity(entity.id));
      },
    },
  ];
  const folderOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        dispatch(
          explorerModel.addEntityCreator({
            parentId: entity.id,
            category: "file",
          })
        );
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        // if (!isOpen) explorerModel.clickedOnDirectory(unit.id);
        // explorerModel.unitCreatingStarted({ parent: unit, type: "directory" });
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
        dispatch(explorerModel.deleteEntity(entity.id));
      },
    },
  ];

  let result = <></>;

  switch (entity.category) {
    case "folder":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            onClick={handleFolderClick}
            onContextMenu={showContextMenu(folderOptions)}
          >
            {indent}
            <IconFolder />
            {entity.name}
          </div>
          {entity.isOpen && (
            <>
              <ul className={classes["children-list"]}>
                {isParentOfCreatedEntity && (
                  <EntityCreator
                    parentId={entity.id}
                    nestingLevel={nestingLevel + 1}
                  />
                )}
                {children.map((child) => (
                  <Entity
                    key={child.id}
                    entity={child}
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
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            onContextMenu={showContextMenu(fileOptions)}
          >
            {indent}
            <IconFile />
            {entity.name}
          </div>
        </li>
      );

      break;
    // case "heading":
    //   break;
  }

  return (
    <>
      {result}
      {/* <ContextMenu /> */}
    </>
  );
}