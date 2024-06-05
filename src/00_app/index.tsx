import { useDispatch } from "react-redux";
import { ContextMenu } from "src/02_widgets/context-menu";
import { contextMenuModel } from "src/04_entities/contextmenu";

function App() {
  const dispatch = useDispatch();
  function contextMenuHandler(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    dispatch(contextMenuModel.showContextMenu());
    event?.preventDefault();
  }

  return (
    <>
      <div
        className="explorer"
        onContextMenu={(event) => contextMenuHandler(event)}
      >
        explorer
      </div>
      <ContextMenu />
    </>
  );
}

export default App;
