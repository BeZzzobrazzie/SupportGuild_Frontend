import { IconChevronRight, IconFile } from "@tabler/icons-react";
import { useContextMenu } from "mantine-contextmenu";
import { useState } from "react";
import classes from "./item-creator.module.css";
import {  explorerSlice } from "../model";
import {
  explorerItemCategory,
  explorerItemParentId,
} from "src/04_entities/explorer/api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

type ExplorerItemCreator = {
  parentId: explorerItemParentId;
  category: explorerItemCategory;
  nestingLevel: number;
  hideExplorerItemCreator(): void;
};

export function ExplorerItemCreator({
  parentId,
  category,
  nestingLevel,
  hideExplorerItemCreator,
}: ExplorerItemCreator) {
  const { showContextMenu } = useContextMenu();

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["explorer-item_indent"]}></div>
    ));

  let result = <></>;

  switch (category) {
    case "folder":
      result = (
        <li>
          <div
            className={classes["explorer-item_header"]}
            onContextMenu={showContextMenu([])}
          >
            {indent}
            <IconChevronRight />
            {/* <IconFolder /> */}
            <ExplorerItemCreatorInput
              category={category}
              parentId={parentId}
              hideExplorerItemCreator={hideExplorerItemCreator}
            />
          </div>
        </li>
      );
      break;
    case "file":
      result = (
        <li>
          <div
            className={classes["explorer-item_header"]}
            onContextMenu={showContextMenu([])}
          >
            {indent}
            <IconFile />
            <ExplorerItemCreatorInput
              category={category}
              parentId={parentId}
              hideExplorerItemCreator={hideExplorerItemCreator}
            />
          </div>
        </li>
      );
      break;
  }
  return <>{result}</>;
}

function ExplorerItemCreatorInput({
  category,
  parentId,
  hideExplorerItemCreator,
}: {
  category: explorerItemCategory;
  parentId: explorerItemParentId;
  hideExplorerItemCreator(): void;
}) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");
  const initialEntity = {
    name: inputValue,
    category: category,
    parentId: parentId,
  };

  const isAddEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsAddExplorerItemPending(state)
  );

  function handleBlur() {
    if (canSave) {
      hideExplorerItemCreator();
    }
  }

  const canSave = initialEntity && !isAddEntitiesPending;
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // event.preventDefault();
    // if (canSave) {
    //   try {
    //     await dispatch(addExplorerItemTh(initialEntity)).unwrap();
    //     hideExplorerItemCreator();
    //   } catch (err) {
    //     console.error("Failed to save the entity: ", err);
    //   }
    // }
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
          disabled={!canSave}
        />
        {isAddEntitiesPending && <div>Loading...</div>}
      </form>
    </>
  );
}
