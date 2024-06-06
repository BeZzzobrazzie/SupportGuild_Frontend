import { IconFolder, IconFile } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { entityType } from "../../lib/types";
import { RootState } from "src/00_app/store";
import classes from "./classes.module.css";
import { explorerModel } from "../..";

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

  switch (entity.type) {
    case "folder":
      return (
        <li>
          <div className={classes["entity_header"]} onClick={handleFolderClick}>
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
      return (
        <li>
          <div className={classes["entity_header"]}>
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

  return <></>;
}
