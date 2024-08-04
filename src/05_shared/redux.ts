import {
  combineSlices,
  createAsyncThunk,
  createSelector,
  ThunkAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { store, extraArgument } from "src/00_app/store";

export const rootReducer = combineSlices();

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = any;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  typeof extraArgument,
  UnknownAction
>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const createAppSelector = createSelector.withTypes<RootState>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: typeof extraArgument;
}>();
