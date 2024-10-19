import { Button, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { templateCardsSlice } from "../model";

export function SearchModeSwitcher() {
  const dispatch = useAppDispatch();
  const searchArea = useAppSelector((state) => state.templateCards.searchArea);
  let content = searchArea === "all" ? "All collections" : "Current collection";

  function handleClick() {
    if (searchArea === "all") {
      content = "Current collection";
      dispatch(templateCardsSlice.actions.changeSearchArea("current"));
    } else {
      content = "All collections";
      dispatch(templateCardsSlice.actions.changeSearchArea("all"));
    }
  }

  return (
    <Button variant="transparent" onClick={handleClick}>
      {content}
    </Button>
  );
}
