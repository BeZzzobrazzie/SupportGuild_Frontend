import React from "react";
import ReactDOM from "react-dom/client";
import App from "./00_app";
import { Provider } from "react-redux";
import { store } from "./00_app/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./05_shared/api";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  </Provider>
);
