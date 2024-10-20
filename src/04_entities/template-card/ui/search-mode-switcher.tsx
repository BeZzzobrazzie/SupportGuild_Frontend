import { Button, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { templateCardsSlice } from "../model";
import { useTranslation } from "react-i18next";

export function SearchModeSwitcher() {
  const dispatch = useAppDispatch();
  const searchArea = useAppSelector((state) => state.templateCards.searchArea);
  const { t, i18n } = useTranslation();
  let content =
    searchArea === "all"
      ? t("commandPanel.searchAreaAll")
      : t("commandPanel.searchAreaCurrent");

  function handleClick() {
    if (searchArea === "all") {
      content = t("commandPanel.searchAreaCurrent");
      dispatch(templateCardsSlice.actions.changeSearchArea("current"));
    } else {
      content = t("commandPanel.searchAreaAll");
      dispatch(templateCardsSlice.actions.changeSearchArea("all"));
    }
  }

  return (
    <Button variant="transparent" onClick={handleClick}>
      {content}
    </Button>
  );
}
