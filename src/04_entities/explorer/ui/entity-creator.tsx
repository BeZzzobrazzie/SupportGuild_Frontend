import { IconChevronRight, IconFile, IconFolder } from "@tabler/icons-react";
import classes from "./entity-creator.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { useState } from "react";
import { addEntity, explorerSlice } from "../model";

import { useContextMenu } from "mantine-contextmenu";
import { explorerItemCategoryType, explorerItemParentId } from "src/04_entities/explorer/api/types";
// import { useAddEntityMutation } from "src/05_shared/api/apiSlice";

type EntityCreatorType = {
  parentId: explorerItemParentId;
  category: explorerItemCategoryType;
  nestingLevel: number;
  hideEntityCreator(): void;
};

export function EntityCreator({
  parentId,
  category,
  nestingLevel,
  hideEntityCreator,
}: EntityCreatorType) {
  const { showContextMenu } = useContextMenu();

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["entity_indent"]}></div>
    ));

  let result = <></>;

  switch (category) {
    case "folder":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            onContextMenu={showContextMenu([])}
          >
            {indent}
            <IconChevronRight />
            {/* <IconFolder /> */}
            <EntityCreatorInput
              category={category}
              parentId={parentId}
              hideEntityCreator={hideEntityCreator}
            />
          </div>
        </li>
      );
      break;
    case "file":
      result = (
        <li>
          <div
            className={classes["entity_header"]}
            onContextMenu={showContextMenu([])}
          >
            {indent}
            <IconFile />
            <EntityCreatorInput
              category={category}
              parentId={parentId}
              hideEntityCreator={hideEntityCreator}
            />
          </div>
        </li>
      );
      break;
  }
  return <>{result}</>;
}

function EntityCreatorInput({
  category,
  parentId,
  hideEntityCreator,
}: {
  category: explorerItemCategoryType;
  parentId: explorerItemParentId;
  hideEntityCreator(): void;
}) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");
  const initialEntity = {
    name: inputValue,
    category: category,
    parentId: parentId,
  };

  const isAddEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsAddEntitiesPending(state)
  );

  function handleBlur() {
    if (canSave) {
      hideEntityCreator();
    }
  }

  const canSave = initialEntity && !isAddEntitiesPending;
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) {
      try {
        await dispatch(addEntity(initialEntity)).unwrap();
        hideEntityCreator();
      } catch (err) {
        console.error("Failed to save the entity: ", err);
      }
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
          disabled={!canSave}
        />
        {isAddEntitiesPending && <div>Loading...</div>}
      </form>
    </>
  );
}
