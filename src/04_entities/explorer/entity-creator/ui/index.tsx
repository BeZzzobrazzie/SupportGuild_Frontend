import { IconChevronRight, IconFile, IconFolder } from "@tabler/icons-react";
import classes from "./classes.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { useState } from "react";
import { explorerModel } from "../..";
import { addEntity, explorerSlice } from "../../model";
import {
  explorerItemCategoryType,
  explorerItemParentId,
} from "../../lib/types";
import { useContextMenu } from "mantine-contextmenu";
// import { useAddEntityMutation } from "src/05_shared/api/apiSlice";

type EntityCreatorType = {
  parentId: explorerItemParentId;
  nestingLevel: number;
};

export function EntityCreator({ parentId, nestingLevel }: EntityCreatorType) {
  const { showContextMenu } = useContextMenu();

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
            onContextMenu={showContextMenu([])}
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
            onContextMenu={showContextMenu([])}
          >
            {indent}
            <IconFile />
            <EntityCreatorInput category={category} parentId={parentId} />
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
}: {
  category: explorerItemCategoryType;
  parentId: explorerItemParentId;
}) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");
  const initialEntity = {
    name: inputValue,
    category: category,
    parentId: parentId,
  };

  // const [addEntity, { error: addEntityError, isLoading, isSuccess }] =
  //   useAddEntityMutation();
  const isAddEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsAddEntitiesPending(state)
  );

  function handleBlur() {
    if (canSave) {
      dispatch(explorerModel.removeEntityCreator());
    }
  }

  const canSave = initialEntity && !isAddEntitiesPending;
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) {
      try {
        await dispatch(addEntity(initialEntity)).unwrap();
        dispatch(explorerModel.removeEntityCreator());
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
