import {
  IconFile,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import classes from "./classes.module.css";
import { useContextMenu } from "mantine-contextmenu";
import { useAppDispatch, useAppSelector } from "src/05_shared/lib/hooks";
import { EntityCreator } from "../../entity-creator";
import { explorerModel } from "../..";
import { explorerSlice, updateEntity } from "../../model";
import { explorerItemCategoryType, explorerItemId } from "../../lib/types";
import { Loader } from "@mantine/core";
import { useState } from "react";

interface EntityProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
  parentIsRemoval: boolean;
}
export function Entity({
  explorerItemId,
  nestingLevel,
  parentIsRemoval,
}: EntityProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();
  const isFetchEntitiesPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFetchEntitiesPending(state)
  );
  const explorerItem = useAppSelector((state) =>
    explorerSlice.selectors.selectExplorerItem(state, explorerItemId)
  );
  // console.log(explorerItem)

  const [isUpdating, setIsUpdating] = useState(false);

  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["entity_indent"]}></div>
    ));

  function handleFolderClick() {
    if (explorerItem) {
      if (explorerItem.isOpen)
        dispatch(explorerModel.closeFolder(explorerItem.id));
      else dispatch(explorerModel.openFolder(explorerItem.id));
    }
  }

  const children = useAppSelector((state) =>
    explorerSlice.selectors.selectChildren(state, explorerItemId)
  );

  const [isEntityCreator, setIsEntityCreator] = useState(false);
  const [categoryEntityCreator, setCategoryEntityCreator] =
    useState<explorerItemCategoryType>(null);

  function showEntityCreator() {
    setIsEntityCreator(true);
  }
  function hideEntityCreator() {
    setIsEntityCreator(false);
  }

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
        setIsUpdating(true);
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        dispatch(explorerModel.removeEntity(explorerItemId));
      },
      disabled: explorerItem?.isRemoval,
    },
  ];
  const folderOptions = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        if (explorerItem) {
          if (!explorerItem.isOpen) {
            dispatch(explorerModel.openFolder(explorerItem.id));
          }
        }

        setCategoryEntityCreator("file");
        showEntityCreator();
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        if (explorerItem) {
          if (!explorerItem.isOpen) {
            dispatch(explorerModel.openFolder(explorerItem.id));
          }
        }

        setCategoryEntityCreator("folder");
        showEntityCreator();
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
        setIsUpdating(true);
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        dispatch(explorerModel.removeEntity(explorerItemId));
      },
      disabled: explorerItem?.isRemoval,
    },
  ];

  let content = <></>;

  if (isFetchEntitiesPending) {
    content = <div>Loading...</div>;
  } else if (explorerItem) {
    switch (explorerItem.category) {
      case "folder":
        content = (
          <li>
            <div
              className={classes["entity_header"]}
              onClick={handleFolderClick}
              onContextMenu={
                isUpdating
                  ? (event) => event.stopPropagation()
                  : explorerItem.isRemoval ||
                    parentIsRemoval ||
                    explorerItem.isUpdatePending
                  ? showContextMenu([])
                  : showContextMenu(folderOptions)
              }
            >
              {indent}
              {explorerItem.isOpen ? <IconChevronDown /> : <IconChevronRight />}
              {/* <IconFolder /> */}
              {isUpdating ? (
                <ExplorerItemUpdateInput
                  id={explorerItem.id}
                  name={explorerItem.name}
                  setIsUpdating={setIsUpdating}
                />
              ) : (
                explorerItem.name
              )}
              {(explorerItem.isRemoval ||
                parentIsRemoval ||
                explorerItem.isUpdatePending) && (
                <Loader color="yellow" size="xs" />
              )}
            </div>
            {explorerItem.isOpen && (
              <>
                <ul className={classes["children-list"]}>
                  {isEntityCreator && (
                    <EntityCreator
                      parentId={explorerItem.id}
                      category={categoryEntityCreator}
                      nestingLevel={nestingLevel + 1}
                      hideEntityCreator={hideEntityCreator}
                    />
                  )}
                  {children.map((child) => (
                    <Entity
                      key={child.id}
                      explorerItemId={child.id}
                      nestingLevel={nestingLevel + 1}
                      parentIsRemoval={
                        parentIsRemoval || explorerItem.isRemoval
                      }
                    />
                  ))}
                </ul>
              </>
            )}
          </li>
        );
        break;
      case "file":
        content = (
          <li>
            <div
              className={classes["entity_header"]}
              onContextMenu={
                isUpdating
                  ? (event) => event.stopPropagation()
                  : explorerItem.isRemoval ||
                    parentIsRemoval ||
                    explorerItem.isUpdatePending
                  ? showContextMenu([])
                  : showContextMenu(fileOptions)
              }
            >
              {indent}
              <IconFile />
              {isUpdating ? (
                <ExplorerItemUpdateInput
                  id={explorerItem.id}
                  name={explorerItem.name}
                  setIsUpdating={setIsUpdating}
                />
              ) : (
                explorerItem.name
              )}
              {(explorerItem.isRemoval ||
                parentIsRemoval ||
                explorerItem.isUpdatePending) && (
                <Loader color="yellow" size="xs" />
              )}
            </div>
          </li>
        );

        break;
    }
  }

  return <>{content}</>;
}

function ExplorerItemUpdateInput({
  id,
  name,
  setIsUpdating,
}: {
  id: explorerItemId;
  name: string;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(name);
  const isUpdateItemPending = useAppSelector((state) =>
    explorerSlice.selectors.selectIsUpdateItemPending(state)
  );

  function handleBlur() {
    setIsUpdating(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await dispatch(updateEntity({ id, name: inputValue })).unwrap();
      setIsUpdating(false);
    } catch (err) {
      console.error("Failed to update the entity: ", err);
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
          onContextMenu={(event) => console.log("context")}
          // disabled={isUpdateItemPending}
        />
        {/* {isUpdateItemPending && <Loader color="yellow" size="xs" />} */}
      </form>
    </>
  );
}
