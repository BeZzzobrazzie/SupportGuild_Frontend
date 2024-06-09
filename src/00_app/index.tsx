import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";

import "@mantine/core/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
// import "./style.module.css";

import { ExplorerSmall } from "src/02_widgets/explorer-small";
import { getExplorerUnits } from "src/05_shared/api";

function App() {

  console.log(getExplorerUnits())
  return (
    <MantineProvider defaultColorScheme="dark">
      <ContextMenuProvider>
        <ExplorerSmall />
        {/* <ContextMenu /> */}
      </ContextMenuProvider>
    </MantineProvider>
  );
}

export default App;
