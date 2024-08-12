import { useContextMenu } from "mantine-contextmenu";

import classes from "./explorer-item.module.css";

import {
  explorerItem,
  explorerItemCategory,
  explorerItemId,
  explorerItems,
} from "src/04_entities/explorer/api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addExplorerItem, getExplorerItems } from "../api/explorer-api";
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
} from "@tabler/icons-react";
import { useState } from "react";
import { showContextMenu } from "src/04_entities/contextmenu/model";
import { ExplorerItemCreator } from "./item-creator";

interface ExplorerItemProps {
  explorerItemId: explorerItemId;
  nestingLevel: number;
}
export function ExplorerItem({
  explorerItemId,
  nestingLevel,
}: ExplorerItemProps) {
  const { showContextMenu } = useContextMenu();
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

  let content = <></>;

  if (explorerItem.category === "folder") {
    content = (
      <Folder
        explorerItems={explorerItems}
        explorerItem={explorerItem}
        indent={indent}
        nestingLevel={nestingLevel}
      />
    );
  } else if (explorerItem.category === "file") {
    content = <Collection explorerItem={explorerItem} indent={indent} />;
  } else return <span>Error: unexpected category explorerItem</span>;

  return <>{content}</>;
}

interface FolderProps {
  explorerItems: explorerItems;
  explorerItem: explorerItem;
  indent: JSX.Element[];
  nestingLevel: number;
}

function Folder({
  explorerItems,
  explorerItem,
  indent,
  nestingLevel,
}: FolderProps) {
  const { showContextMenu } = useContextMenu();
  const children = explorerItem.children.map(
    (childId) => explorerItems.byId[childId]
  );

  const [isOpen, setIsOpen] = useState(false);
  // const [isExplorerItemCreator, setIsExplorerItemCreator] = useState(false);
  const [categoryExplorerItemCreator, setCategoryExplorerItemCreator] =
    useState<explorerItemCategory>(null);
  const isExplorerItemCreator = categoryExplorerItemCreator !== null;
  // function showExplorerItemCreator() {
  //   setIsExplorerItemCreator(true);
  // }
  function hideExplorerItemCreator() {
    setCategoryExplorerItemCreator(null);
  }
  const explorerItemCreator = (
    <ExplorerItemCreator
      parentId={explorerItem.id}
      category={categoryExplorerItemCreator}
      nestingLevel={nestingLevel}
      hideExplorerItemCreator={hideExplorerItemCreator}
    />
  );

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setIsOpen(!isOpen);
  }

  // const mutation = useMutation({
  //   mutationFn: addExplorerItem(initialData)
  // })

  const options = [
    {
      key: "new file",
      onClick: () => {
        console.log("new file");
        if (!isOpen) setIsOpen(true);
        setCategoryExplorerItemCreator("file");
      },
    },
    {
      key: "new folder",
      onClick: () => {
        console.log("new folder");
        if (!isOpen) setIsOpen(true);
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
      },
    },
  ];

  

  return (
    <>
      <li>
        <div
          className={classes["explorer-item_header"]}
          onClick={(event) => handleClick(event)}
          onContextMenu={showContextMenu(options)}
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
}

function Collection({ explorerItem, indent }: CollectionProps) {
  return (
    <>
      <li>
        <div className={classes["explorer-item_header"]}>
          {indent}
          <IconFile />
          {explorerItem.name}
        </div>
      </li>
    </>
  );
}
