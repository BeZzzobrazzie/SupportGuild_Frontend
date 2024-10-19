import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { changeSearchTerm } from "../model";

export function SearchInput() {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.templateCards.searchTerm);
  const { t, i18n } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeSearchTerm(e.target.value));
  };

  return (
    <>
      <TextInput
        leftSectionPointerEvents="none"
        leftSection={<IconSearch />}
        autoFocus
        onChange={handleChange}
        value={value}
        placeholder={t("commandPanel.searchPlaceholder")}
      />
    </>
  );
}
