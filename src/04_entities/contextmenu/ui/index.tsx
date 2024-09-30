import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import classes from "./classes.module.css";
import { contextMenuModel } from "src/04_entities/contextmenu";
import { useCoordsContextMenu, useHideContextMenu } from "../lib/hooks";
import { RootState } from "src/05_shared/redux";


interface OptionData {
  key: string;
  name: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export function ContextMenu() {
  const dispatch = useDispatch();
  const { isShowed, position } = useSelector((state: RootState) => {
    return {
      isShowed: state.contextMenu.isShowed,
      position: { x: state.contextMenu.x, y: state.contextMenu.y },
    };
  });
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useCoordsContextMenu({ isShowed, contextMenuRef, position });
  useHideContextMenu();



  return (
    <>
      {isShowed ? (
        <div
          className={classes["context-menu"]}
          style={{ top: position.y, left: position.x }}
          ref={contextMenuRef}
        >
          <button type="button" onClick={() => console.log("copy")}>
            Copy
          </button>
          <button type="button" onClick={() => console.log("past")}>
            Past
          </button>
          <button type="button" onClick={() => console.log("cut")}>
            Cut
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
