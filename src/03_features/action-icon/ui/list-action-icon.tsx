import { ActionIcon, Tooltip } from "@mantine/core";
import {
  IconBold,
  IconList,
  IconListCheck,
  IconListNumbers,
} from "@tabler/icons-react";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import { useTranslation } from "react-i18next";

export function ListActionIcon({
  func,
  type,
}: {
  func: (listType: "bullet" | "number" | "check") => void;
  type: "bullet" | "number" | "check";
}) {
  const { t, i18n } = useTranslation();

  return (
    <Tooltip
      label={
        type === "number"
          ? t("editor.numberedList")
          : type === "check"
          ? t("editor.checkList")
          : t("editor.bulletList")
      }
    >
      <ActionIcon variant="default" onClick={() => func(type)}>
        {type === "number" ? (
          <IconListNumbers />
        ) : type === "check" ? (
          <IconListCheck />
        ) : (
          <IconList />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
