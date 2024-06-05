import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import classes from "./classes.module.css";
import { RootState } from "src/00_app/store";
import { contextMenuModel } from "src/04_entities/contextmenu";

export function ContextMenu() {
  const dispatch = useDispatch();

  const { isShowed, positionX, positionY } = useSelector((state: RootState) => {
    return {
      isShowed: state.contextMenu.isShowed,
      positionX: state.contextMenu.x,
      positionY: state.contextMenu.y,
    };
  });

  useEffect(() => {
    const handleClick = () => dispatch(contextMenuModel.hideContextMenu());
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {isShowed ? (
        <div
          className={classes["context-menu"]}
          style={{ top: positionY, left: positionX }}
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
