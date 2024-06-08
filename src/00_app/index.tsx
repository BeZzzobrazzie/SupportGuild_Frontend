import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";

import '@mantine/core/styles.layer.css';
import "mantine-contextmenu/styles.layer.css";
// import "./style.module.css";

import { ExplorerSmall } from "src/02_widgets/explorer-small";

function App() {
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
