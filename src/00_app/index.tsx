import { useDispatch } from "react-redux"
import { ContextMenu } from "src/02_widgets/context-menu"
import { contextMenuModel } from "src/04_entities/contextmenu";


function App() {


  const dispatch = useDispatch();
  function contextMenuHandler() {
    dispatch(contextMenuModel.showContextMenu())
  }

  return (
    <>
      <div className="explorer" onContextMenu={contextMenuHandler}>
        explorer
      </div>
      <ContextMenu />
    </>
  )
}

export default App
