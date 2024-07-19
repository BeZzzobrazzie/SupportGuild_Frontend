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
import { getTemplateCards } from "src/05_shared/api";

function App() {

  store.dispatch(fetchEntities());

  return (
    <MantineProvider defaultColorScheme="dark">
      <ContextMenuProvider>
        <ExplorerSmall />
        <TemplateCard />
        <button onClick={getTemplateCards}>click</button>
      </ContextMenuProvider>
    </MantineProvider>
  );
}

export default App;
