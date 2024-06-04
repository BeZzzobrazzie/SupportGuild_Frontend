import { useSelector } from "react-redux";
import { RootState } from "src/00_app/store";

export function ContextMenu() {
  function showContextMenu() {}

  const isShowed = useSelector((state: RootState) => state.contextMenu.isShowed);

  return (
    <>{isShowed ? <div className="contextmenu">contextmenu</div> : <></>}</>
  );
}
