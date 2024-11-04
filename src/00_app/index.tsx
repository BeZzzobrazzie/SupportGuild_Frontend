import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";

import "@mantine/core/styles.layer.css";
import "@mantine/tiptap/styles.css";
import "mantine-contextmenu/styles.layer.css";
import '@mantine/notifications/styles.css';
import "./style.css";

import { ModalsProvider } from "@mantine/modals";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TemplatesPage } from "src/01_pages/templates-page";
import { queryClient } from "src/05_shared/api";
import { QueryProvider } from "./providers/query-provider";
import { mantineTheme } from "./mantine-theme";
import { CreateLinkModal } from "src/03_features/action-icon/ui/link-action-icon";
import { OperatorsPage } from "src/01_pages/operators-page";
import { Outlet, RouterProvider } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { Notifications } from '@mantine/notifications';

function App() {
  return (
    <Provider store={store}>
      <QueryProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark" theme={mantineTheme}>
          <ModalsProvider modals={{ createLinkModal: CreateLinkModal }}>
            <ContextMenuProvider>
              <DndProvider backend={HTML5Backend}>
                <Notifications />
                {/* <TemplatesPage /> */}
                {/* <OperatorsPage /> */}
                <Outlet />
              </DndProvider>
            </ContextMenuProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryProvider>
    </Provider>
  );
}

export default App;
