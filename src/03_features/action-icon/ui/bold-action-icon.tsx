import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBold } from "@tabler/icons-react";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import { useTranslation } from "react-i18next";

export function BoldActionIcon({ editor }: { editor: LexicalEditor | null }) {
  const { t, i18n } = useTranslation();
  return (
    <Tooltip label={t("editor.boldFont")}>
      <ActionIcon
        variant="default"
        onClick={() => {
          editor && editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <IconBold />
      </ActionIcon>
    </Tooltip>
  );
}
