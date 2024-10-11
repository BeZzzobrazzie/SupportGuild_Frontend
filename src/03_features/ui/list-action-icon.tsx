import { ActionIcon, Tooltip } from "@mantine/core";
import {
  IconBold,
  IconList,
  IconListCheck,
  IconListNumbers,
} from "@tabler/icons-react";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";

export function ListActionIcon({
  func,
  type,
}: {
  func: (listType: "bullet" | "number" | "check") => void;
  type: "bullet" | "number" | "check";
}) {
  return (
    <Tooltip
      label={
        type === "number"
          ? "Numbered list"
          : type === "check"
          ? "Check list"
          : "Bullet list"
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
