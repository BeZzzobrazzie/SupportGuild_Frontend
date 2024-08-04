import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "src/05_shared/redux";

export const extraArgument = {};

export const store = configureStore({
  reducer: rootReducer,
});
