import { IconFile, IconFolder } from "@tabler/icons-react";
import { entityCategoryType, parentIdType } from "../../lib/types";
import classes from "./classes.module.css";
import { useAppSelector } from "src/05_shared/lib/hooks";

type EntityCreatorType = {
  // category: entityCategoryType;
  parentId: parentIdType;
  nestingLevel: number;
};

export function EntityCreator({
  // category,
  parentId,
  nestingLevel,
}: EntityCreatorType) {
  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["entity_indent"]}></div>
    ));
  const category = useAppSelector((state) => state.explorer.entityCreation.category);
  let result = <></>;

  switch (category) {
    case "folder":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            // onClick={handleFolderClick}
            // onContextMenu={showContextMenu(folderOptions)}
          >
            {indent}
            <IconFolder />
            name
          </div>
        </li>
      );
      break;
    case "file":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            // onContextMenu={showContextMenu(fileOptions)}
          >
            {indent}
            <IconFile />
            name
          </div>
        </li>
      );

      break;
    // case "heading":
    //   break;
  }

  return <>{result}</>;
}
