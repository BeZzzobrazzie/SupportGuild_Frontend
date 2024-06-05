import { useSelector } from "react-redux";
import { RootState } from "src/00_app/store";
import classes from "./classes.module.css";


export function ContextMenu() {
  function showContextMenu() {}

  const isShowed = useSelector(
    (state: RootState) => state.contextMenu.isShowed
  );
  const position = {x: 0, y: 0};

  return (
    <>
      {isShowed ? (
        <div className={classes["context-menu"]} style={{top: position.y, left: position.x}}>
          <button type="button">Copy</button>
          <button type="button">Past</button>
          <button type="button">Cut</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
