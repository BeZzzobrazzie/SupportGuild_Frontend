import {
  ContextMenuContent,
  ContextMenuItemOptions,
  useContextMenu,
} from "mantine-contextmenu";

import classes from "./explorer-item.module.css";

import {
  dataForUpdate,
  explorerItem,
  explorerItemCategory,
  explorerItemId,
  explorerItems,
} from "src/04_entities/explorer/api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import {
  useIsMutating,
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import {
  addExplorerItem,
  getExplorerItems,
  removeExplorerItem,
  updateExplorerItem,
} from "../api/explorer-api";
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
} from "@tabler/icons-react";
import { useState } from "react";
import { showContextMenu } from "src/04_entities/contextmenu/model";
import { ExplorerItemCreator } from "./item-creator";
import {
  clickOnCollection,
  clickOnFolder,
  deleteFolder,
  explorerSlice,
  selectItem,
  toggleSelectItem,
} from "../model";
import { queryClient } from "src/05_shared/api";
import { useIsMutatingExplorerItems } from "../lib/use-is-mutating-explorer-items";
import { Loader } from "@mantine/core";
import { useDeleteItemMutation } from "../lib/use-delete-item-mutation";
import { ExplorerItemUpdateInput } from "./item-update-input";
import { useDeleteItemsMutation } from "../lib/use-delete-items-mutation";

interface ExplorerItemProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}
export function ExplorerItem({
  explorerItemId,
  nestingLevel,
}: ExplorerItemProps) {
  const dispatch = useAppDispatch();
  const {
    isPending,
    isError,
    data: explorerItems,
    error,
  } = useQuery(getExplorerItems());
  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error: {error.message}</span>;
  if (!explorerItems) return <span>Error: no data</span>;

  const explorerItem = explorerItems.byId[explorerItemId];


  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["explorer-item_indent"]}></div>
    ));

  const isSelectedItem = useAppSelector((state) =>
    explorerSlice.selectors.selectIsSelectedItem(state, explorerItemId)
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const updateMutation = useMutation({
    mutationFn: async (data: dataForUpdate) => await updateExplorerItem(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
        return {
          ...oldData,
          byId: {
            ...oldData.byId,
            [data.id]: data,
          },
        };
      });
      setIsUpdating(false);
    },
    mutationKey: ["updateExplorerItem"],
  });
  const deleteItemMutation = useDeleteItemMutation(explorerItem);
  const deleteItemsMutation = useDeleteItemsMutation();
  const isMutatingExplorerItems = useIsMutatingExplorerItems();

  const loadingOptions = [
    {
      key: "Loading...",
      onClick: () => {},
      disabled: true,
    },
  ];

  let content = <></>;
  if (!explorerItem) return <span>Error: no data</span>;

  if (explorerItem.category === "folder") {
    content = (
      <Folder
        explorerItem={explorerItem}
        indent={indent}
        nestingLevel={nestingLevel}
        isMutatingExplorerItems={isMutatingExplorerItems}
        loadingOptions={loadingOptions}
        deleteItemMutation={deleteItemMutation}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        updateMutation={updateMutation}
        isSelectedItem={isSelectedItem}
        deleteItemsMutation={deleteItemsMutation}
      />
    );
  } else if (explorerItem.category === "file") {
    content = (
      <Collection
        explorerItem={explorerItem}
        indent={indent}
        isMutatingExplorerItems={isMutatingExplorerItems}
        loadingOptions={loadingOptions}
        deleteItemMutation={deleteItemMutation}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        updateMutation={updateMutation}
        isSelectedItem={isSelectedItem}
        deleteItemsMutation={deleteItemsMutation}
      />
    );
  } else return <span>Error: unexpected category explorerItem</span>;

  return <>{content}</>;
}

interface FolderProps {
  explorerItem: explorerItem;
  indent: JSX.Element[];
  nestingLevel: number;
  isMutatingExplorerItems: boolean;
  loadingOptions: ContextMenuContent;
  deleteItemMutation: UseMutationResult<
    {
      id: number;
    },
    Error,
    number,
    unknown
  >;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  updateMutation: UseMutationResult<
    {
      id: number;
      category: "file" | "folder" | null;
      name: string;
      parentId: number | null;
      children: number[];
    },
    Error,
    dataForUpdate,
    unknown
  >;
  isSelectedItem: boolean;
  deleteItemsMutation: UseMutationResult<
    {
      ids: number[];
    },
    Error,
    void,
    unknown
  >;
}

function Folder({
  explorerItem,
  indent,
  nestingLevel,
  isMutatingExplorerItems,
  loadingOptions,
  deleteItemMutation,
  isUpdating,
  setIsUpdating,
  updateMutation,
  isSelectedItem,
  deleteItemsMutation,
}: FolderProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  const {
    isPending,
    isError,
    data: explorerItems,
    error,
  } = useQuery(getExplorerItems());

  if (!explorerItems) return <span>Error: no data</span>;

  const children = explorerItems.ids
    .map((id) => explorerItems.byId[id])
    .filter((item) => item.parentId === explorerItem.id);

  const isOpen = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFolderOpen(state, explorerItem.id)
  );
  const selectedItemsIds = useAppSelector((state) => explorerSlice.selectors.selectSelectedItemsIds(state))
  console.log(selectedItemsIds)

  const [categoryExplorerItemCreator, setCategoryExplorerItemCreator] =
    useState<explorerItemCategory>(null);
  const isExplorerItemCreator = categoryExplorerItemCreator !== null;

  function hideExplorerItemCreator() {
    setCategoryExplorerItemCreator(null);
  }
  const explorerItemCreator = (
    <ExplorerItemCreator
      parentId={explorerItem.id}
      category={categoryExplorerItemCreator}
      nestingLevel={nestingLevel + 1}
      hideExplorerItemCreator={hideExplorerItemCreator}
    />
  );

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (explorerItem) {
      if (event.ctrlKey) {
        dispatch(toggleSelectItem(explorerItem.id));
      } else {
        dispatch(selectItem(explorerItem.id));
        dispatch(clickOnFolder(explorerItem.id));
      }
    }
  }

  const options = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        if (!isOpen) dispatch(clickOnFolder(explorerItem.id));
        setCategoryExplorerItemCreator("file");
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        if (!isOpen) dispatch(clickOnFolder(explorerItem.id));
        setCategoryExplorerItemCreator("folder");
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
        if (isSelectedItem) {
          deleteItemsMutation.mutate();
        } else {
          deleteItemMutation.mutate(explorerItem.id);
        }
      },
    },
  ];

  return (
    <>
      <li>
        <div
          className={classes["explorer-item_header"]}
          onClick={(event) => handleClick(event)}
          onContextMenu={
            isMutatingExplorerItems
              ? showContextMenu(loadingOptions)
              : showContextMenu(options)
          }
        >
          <div className={classes["explorer-item__inactive"]}></div>
          <div
            className={
              isSelectedItem
                ? classes["explorer-item__select"]
                : classes["explorer-item__unselect"]
            }
          ></div>
          {indent}
          {isOpen ? <IconChevronDown /> : <IconChevronRight />}
          {isUpdating ? (
            <ExplorerItemUpdateInput
              id={explorerItem.id}
              name={explorerItem.name}
              setIsUpdating={setIsUpdating}
              updateMutation={updateMutation}
            />
          ) : (
            explorerItem.name
          )}
          {(deleteItemMutation.isPending || updateMutation.isPending || deleteItemsMutation.isPending) && (
            <Loader color="yellow" size="xs" />
          )}
        </div>
        {isOpen && (
          <ul className={classes["children-list"]}>
            {isExplorerItemCreator && explorerItemCreator}
            {children.map((child) => (
              <ExplorerItem
                key={child.id}
                explorerItemId={child.id}
                nestingLevel={nestingLevel + 1}
              />
            ))}
          </ul>
        )}
      </li>
    </>
  );
}

interface CollectionProps {
  explorerItem: explorerItem;
  indent: JSX.Element[];
  isMutatingExplorerItems: boolean;
  loadingOptions: ContextMenuContent;
  deleteItemMutation: UseMutationResult<
    {
      id: number;
    },
    Error,
    number,
    unknown
  >;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  updateMutation: UseMutationResult<
    {
      id: number;
      category: "file" | "folder" | null;
      name: string;
      parentId: number | null;
      children: number[];
    },
    Error,
    dataForUpdate,
    unknown
  >;
  isSelectedItem: boolean;
  deleteItemsMutation: UseMutationResult<
    {
      ids: number[];
    },
    Error,
    void,
    unknown
  >;
}

function Collection({
  explorerItem,
  indent,
  isMutatingExplorerItems,
  loadingOptions,
  deleteItemMutation,
  isUpdating,
  setIsUpdating,
  updateMutation,
  isSelectedItem,
  deleteItemsMutation,
}: CollectionProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  const isActiveCollection = useAppSelector((state) =>
    explorerSlice.selectors.selectIsActiveCollection(state, explorerItem.id)
  );

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (explorerItem) {
      if (event.ctrlKey) {
        dispatch(toggleSelectItem(explorerItem.id));
      } else {
        dispatch(selectItem(explorerItem.id));
        dispatch(clickOnCollection(explorerItem.id));
      }
    }
  }

  const options = [
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
        if (isSelectedItem) {
          deleteItemsMutation.mutate();
        } else {
          deleteItemMutation.mutate(explorerItem.id);
        }
      },
    },
  ];

  return (
    <>
      <li>
        <div
          className={classes["explorer-item_header"]}
          onContextMenu={
            isMutatingExplorerItems
              ? showContextMenu(loadingOptions)
              : showContextMenu(options)
          }
          onClick={handleClick}
        >
          <div
            className={
              isActiveCollection
                ? classes["explorer-item__active"]
                : classes["explorer-item__inactive"]
            }
          ></div>
          <div
            className={
              isSelectedItem
                ? classes["explorer-item__select"]
                : classes["explorer-item__unselect"]
            }
          ></div>
          {indent}
          <IconFile />
          {isUpdating ? (
            <ExplorerItemUpdateInput
              id={explorerItem.id}
              name={explorerItem.name}
              setIsUpdating={setIsUpdating}
              updateMutation={updateMutation}
            />
          ) : (
            explorerItem.name
          )}
          {(deleteItemMutation.isPending || updateMutation.isPending || deleteItemsMutation.isPending) && (
            <Loader color="yellow" size="xs" />
          )}
        </div>
      </li>
    </>
  );
}
