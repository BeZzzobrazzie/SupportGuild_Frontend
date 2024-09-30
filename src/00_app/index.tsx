import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";

import "@mantine/core/styles.layer.css";
import "@mantine/tiptap/styles.css";
import "mantine-contextmenu/styles.layer.css";
// import "./style.module.css";

import { ModalsProvider } from "@mantine/modals";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TemplatesPage } from "src/01_pages/templates-page";

function App() {
  // store.dispatch(fetchExplorerItemsTh());

  return (
    <MantineProvider defaultColorScheme="dark">
      <ModalsProvider>
        <ContextMenuProvider>
          <DndProvider backend={HTML5Backend}>
            <TemplatesPage />
          </DndProvider>
        </ContextMenuProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
