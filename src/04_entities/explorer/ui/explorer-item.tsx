import {
  ContextMenuContent,
  ContextMenuItemOptions,
  useContextMenu,
} from "mantine-contextmenu";

import classes from "./explorer-item.module.css";

import {
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
} from "../api/explorer-api";
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
} from "@tabler/icons-react";
import { useState } from "react";
import { showContextMenu } from "src/04_entities/contextmenu/model";
import { ExplorerItemCreator } from "./item-creator";
import { clickOnFolder, deleteFolder, explorerSlice } from "../model";
import { queryClient } from "src/05_shared/api";

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

  
  // const deleteItemMutation = useMutation({
    mutationFn: async (data: explorerItemId) => await removeExplorerItem(data),
    onSuccess: (data) => {
      // queryClient.invalidateQueries({queryKey: ["explorerItems"]})
      queryClient.setQueryData(["explorerItems"], (oldData: explorerItems) => {
        let newById = oldData.byId;
        let newIds = oldData.ids;

        function deleteElementTree(parentId: explorerItemId) {
          let explorerItemsByIdToRemove: number[] = [];
          delete newById[parentId];
          newIds = newIds.filter((item) => item !== parentId);

          for (let key in newById) {
            if (!!newById[key]) {
              if (newById[key].parentId === parentId) {
                explorerItemsByIdToRemove.push(Number(key));
              }
            }
          }

          explorerItemsByIdToRemove.map((itemId) => {
            deleteElementTree(itemId);
          });
        }
        deleteElementTree(data.id);

        // const { [data.id]: deleteVar, ...newById } = oldData.byId;
        // const newIds = oldData.ids.filter((id) => id !== data.id);
        return {
          ...oldData,
          byId: newById,
          ids: newIds,
        };
      });
      if (explorerItem.category === "folder") {
        dispatch(deleteFolder(data.id));
      }
    },
    mutationKey: ["removeExplorerItem"],
  });

  const isMutatingExplorerItems =
    useIsMutating({ mutationKey: ["addExplorerItem"] }) > 0;
  const loadingOptions = [
    {
      key: "Loading...",
      onClick: () => {},
      disabled: true,
    },
  ];

  let content = <></>;
  if (explorerItem.category === "folder") {
    content = (
      <Folder
        explorerItems={explorerItems}
        explorerItem={explorerItem}
        indent={indent}
        nestingLevel={nestingLevel}
        isMutatingExplorerItems={isMutatingExplorerItems}
        loadingOptions={loadingOptions}
        deleteItemMutation={deleteItemMutation}
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
      />
    );
  } else return <span>Error: unexpected category explorerItem</span>;

  return <>{content}</>;
}

interface FolderProps {
  explorerItems: explorerItems;
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
}

function Folder({
  explorerItems,
  explorerItem,
  indent,
  nestingLevel,
  isMutatingExplorerItems,
  loadingOptions,
  deleteItemMutation,
}: FolderProps) {
  const { showContextMenu } = useContextMenu();
  const dispatch = useAppDispatch();

  const children = explorerItems.ids
    .map((id) => explorerItems.byId[id])
    .filter((item) => item.parentId === explorerItem.id);

  // const [isOpen, setIsOpen] = useState(false);
  const isOpen = useAppSelector((state) =>
    explorerSlice.selectors.selectIsFolderOpen(state, explorerItem.id)
  );

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
    // setIsOpen(!isOpen);
    dispatch(clickOnFolder(explorerItem.id));
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
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        deleteItemMutation.mutate(explorerItem.id);
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
          {indent}
          {isOpen ? <IconChevronDown /> : <IconChevronRight />}
          {explorerItem.name}
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
}

function Collection({
  explorerItem,
  indent,
  isMutatingExplorerItems,
  loadingOptions,
  deleteItemMutation,
}: CollectionProps) {
  const { showContextMenu } = useContextMenu();

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
      },
    },
    {
      key: "delete",
      onClick: () => {
        console.log("delete");
        deleteItemMutation.mutate(explorerItem.id);
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
        >
          {indent}
          <IconFile />
          {explorerItem.name}
        </div>
      </li>
    </>
  );
}
