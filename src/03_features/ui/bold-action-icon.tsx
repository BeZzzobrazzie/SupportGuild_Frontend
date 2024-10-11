import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBold } from "@tabler/icons-react";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";

export function BoldActionIcon({ editor }: { editor: LexicalEditor | null }) {
  return (
    <Tooltip label={"Bold font"}>
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
