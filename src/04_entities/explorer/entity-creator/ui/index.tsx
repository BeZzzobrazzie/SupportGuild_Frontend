import { IconChevronRight, IconFile, IconFolder } from "@tabler/icons-react";
import { entityCategoryType, parentIdType } from "../../lib/types";
import classes from "./classes.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { useState } from "react";
import { explorerModel } from "../..";

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
  const category = useAppSelector(
    (state) => state.explorer.entityCreation.category
  );
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
            <IconChevronRight />
            {/* <IconFolder /> */}
            <EntityCreatorInput category={category} parentId={parentId} />

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
            <EntityCreatorInput category={category} parentId={parentId} />
          </div>
        </li>
      );

      break;
    // case "heading":
    //   break;
  }

  return <>{result}</>;
}

function EntityCreatorInput({
  category,
  parentId,
}: {
  category: entityCategoryType;
  parentId: parentIdType;
}) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");
  const initialEntity = {
    name: inputValue,
    category: category,
    parentId: parentId,
  };

  function handleBlur() {
    dispatch(explorerModel.removeEntityCreator());
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("submit");
    console.log(initialEntity);
    try {
      await dispatch(explorerModel.addNewEntity(initialEntity)).unwrap();
      dispatch(explorerModel.removeEntityCreator());
    } catch (err) {
      console.error("Failed to save the entity: ", err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          required
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={handleBlur}
        ></input>
      </form>
    </>
  );
}
