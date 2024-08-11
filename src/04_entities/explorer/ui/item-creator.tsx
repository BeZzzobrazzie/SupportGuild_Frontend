import { IconChevronRight, IconFile } from "@tabler/icons-react";
import { useContextMenu } from "mantine-contextmenu";
import { useState } from "react";
import classes from "./item-creator.module.css";
import { explorerSlice } from "../model";
import {
  explorerItemCategory,
  explorerItemParentId,
  initialExplorerItem,
} from "src/04_entities/explorer/api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useMutation } from "@tanstack/react-query";
import { addExplorerItem } from "../api/explorer-api";

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

  return (
    <li>
      <div
        className={classes["explorer-item_header"]}
        onContextMenu={showContextMenu([])}
      >
        {indent}
        {category === "folder" && <IconChevronRight />}
        {category === "file" && <IconFile />}

        {/* <IconFolder /> */}
        <ExplorerItemCreatorInput
          category={category}
          parentId={parentId}
          hideExplorerItemCreator={hideExplorerItemCreator}
        />
      </div>
    </li>
  );
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
  const mutation = useMutation({
    mutationFn: (data: initialExplorerItem) => addExplorerItem(data)
  })

  function handleBlur() {
    if (canSave) {
      hideExplorerItemCreator();
    }
  }

  const canSave = initialEntity
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) {
      mutation.mutate(initialEntity)
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
        {mutation.isPending && <div>Loading...</div>}
        {mutation.isError && <div>Error...</div>}
        {mutation.isSuccess && <div>Success...</div>}

      </form>
    </>
  );
}
