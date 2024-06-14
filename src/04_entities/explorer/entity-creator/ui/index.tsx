import { IconChevronRight, IconFile, IconFolder } from "@tabler/icons-react";
import { entityCategoryType, parentIdType } from "../../lib/types";
import classes from "./classes.module.css";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { useState } from "react";
import { explorerModel } from "../..";
import { useAddEntityMutation } from "src/05_shared/api/apiSlice";

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
          <div className={classes["entity_header"]}>
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
          <div className={classes["entity_header"]}>
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

  const [addEntity, { error: addEntityError, isLoading, isSuccess }] =
    useAddEntityMutation();

  function handleBlur() {
    if (canSave) {
      dispatch(explorerModel.removeEntityCreator());
    }
  }

  const canSave = initialEntity && !isLoading;
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) {
      try {
        await addEntity(initialEntity).unwrap();
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
        {isLoading && <div>Loading...</div>}
      </form>
    </>
  );
}
