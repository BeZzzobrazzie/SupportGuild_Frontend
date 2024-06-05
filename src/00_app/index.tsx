import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ContextMenu } from "src/02_widgets/context-menu";
import { contextMenuModel } from "src/04_entities/contextmenu";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      dispatch(
        contextMenuModel.showContextMenu({ x: event.clientX, y: event.clientY })
      );
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <>
      <div className="explorer">explorer</div>
      <input type="text" />
      <ContextMenu />
    </>
  );
}

export default App;
