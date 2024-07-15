import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";

import "@mantine/core/styles.layer.css";
import '@mantine/tiptap/styles.css';
import "mantine-contextmenu/styles.layer.css";
// import "./style.module.css";

import { ExplorerSmall } from "src/02_widgets/explorer-small";
import { fetchEntities } from "src/04_entities/explorer/model";
import { store } from "./store";
import { TemplateCard } from "src/04_entities/template-card";

function App() {

  store.dispatch(fetchEntities());

  return (
    <MantineProvider defaultColorScheme="dark">
      <ContextMenuProvider>
        <ExplorerSmall />
        <TemplateCard />
      </ContextMenuProvider>
    </MantineProvider>
  );
}

export default App;
