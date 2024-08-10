import { useContextMenu } from "mantine-contextmenu";

import classes from "./explorer-item.module.css";

import {
  explorerItem,
  explorerItemId,
} from "src/04_entities/explorer/api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useQuery } from "@tanstack/react-query";
import { getExplorerItems } from "../api/explorer-api";

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
    content = <Folder explorerItem={explorerItem} indent={indent} />;
  } else if (explorerItem.category === "file") {
    content = <Collection explorerItem={explorerItem} indent={indent} />;
  } else return <span>Error: unexpected category explorerItem</span>;

  return <>{content}</>;
}

interface FolderProps {
  explorerItems: 
  explorerItem: explorerItem;
  indent: JSX.Element[];
}

function Folder({ explorerItem, indent }: FolderProps) {

  const children = Object.values(explorerItems.byId).filter(
    (child) => child.parentId === null
  );
  return (
    <>
      <li>
        <div className={classes["explorer-item_header"]}>
          {indent}
          {explorerItem.name}
        </div>
        <ul className={classes["children-list"]}>
                  {children.map((child) => (
                    <ExplorerItem
                      key={child.id}
                      explorerItemId={child.id}
                      nestingLevel={nestingLevel + 1}
                      parentIsRemoval={
                        parentIsRemoval || explorerItem.isRemoval
                      }
                    />
                  ))}
                </ul>
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
          {explorerItem.name}
        </div>
      </li>
    </>
  );
}
