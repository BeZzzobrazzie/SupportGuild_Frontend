import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import classes from "./classes.module.css";
import { RootState } from "src/00_app/store";
import { contextMenuModel } from "src/04_entities/contextmenu";

export function ContextMenu() {
  const dispatch = useDispatch();
  const { isShowed, position } = useSelector((state: RootState) => {
    return {
      isShowed: state.contextMenu.isShowed,
      position: { x: state.contextMenu.x, y: state.contextMenu.y },
    };
  });
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  // const [position, setPosition] = useState<{x: number, y: number}>({x: mouseCoordsX, y: mouseCoordsY})

  useEffect(() => {
    if (isShowed && contextMenuRef.current) {
      const { x, y } = position;
      const rootW = contextMenuRef.current.offsetWidth;
      const rootH = contextMenuRef.current.offsetHeight;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      let newX = x;
      let newY = y;

      if (x + rootW > screenW) {
        newX = screenW - rootW;
      }

      if (y + rootH > screenH) {
        newY = screenH - rootH;
      }

      if (newX !== x || newY !== y) {
        dispatch(contextMenuModel.setCoords({ x: newX, y: newY }));
      }
    }
  });

  useEffect(() => {
    const handleClick = () => dispatch(contextMenuModel.hideContextMenu());
    const handleWindowBlur = () => dispatch(contextMenuModel.hideContextMenu());
    document.addEventListener("click", handleClick);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

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
