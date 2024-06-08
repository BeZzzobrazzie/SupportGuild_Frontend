import { IconFolder, IconFile } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { entityType } from "../../lib/types";
import { RootState } from "src/00_app/store";
import classes from "./classes.module.css";
import { explorerModel } from "../..";
import { contextMenuModel } from "src/04_entities/contextmenu";

interface EntityProps {
  entity: entityType;
  nestingLevel: number;
}
export function Entity({ entity, nestingLevel }: EntityProps) {
  const dispatch = useDispatch();
  const children = useSelector((state: RootState) =>
    state.explorer.filter((item) => item.parent === entity.id)
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

  function handleContextMenu(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    dispatch(contextMenuModel.showContextMenu());
    dispatch(
      contextMenuModel.setCoords({ x: event.clientX, y: event.clientY })
    );
    event.preventDefault();
  }

  let result = <></>;

  switch (entity.type) {
    case "folder":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            onClick={handleFolderClick}
            onContextMenu={handleContextMenu}
          >
            {indent}
            <IconFolder />
            {entity.name}
          </div>
          {entity.isOpen && (
            <ul className={classes["children-list"]}>
              {children.map((child) => (
                <Entity
                  key={child.id}
                  entity={child}
                  nestingLevel={nestingLevel + 1}
                />
              ))}
            </ul>
          )}
        </li>
      );
      break;
    case "file":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            onContextMenu={(
              event: React.MouseEvent<HTMLDivElement, MouseEvent>
            ) => handleContextMenu(event)}
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
