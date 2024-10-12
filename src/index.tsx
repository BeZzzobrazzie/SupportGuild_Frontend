import React from "react";
import ReactDOM from "react-dom/client";
import App from "./00_app";
import { Provider } from "react-redux";
import { store } from "./00_app/store";
import "./05_shared/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
