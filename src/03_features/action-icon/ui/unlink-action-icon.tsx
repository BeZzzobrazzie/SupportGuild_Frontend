import { ActionIcon, Tooltip } from "@mantine/core";
import { IconUnlink } from "@tabler/icons-react";
import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  $createTextNode,
} from "lexical";
import { $isLinkNode } from "@lexical/link";

export function UnlinkActionIcon({ editor }: { editor: LexicalEditor | null }) {
  function handleClick() {
    editor &&
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          nodes.forEach((node) => {
            if ($isLinkNode(node)) {
              const textContent = node.getTextContent();
              const textNode = $createTextNode(textContent);
              node.replace(textNode);
            }
          });
        }
      });
  }

  return (
    <Tooltip label="Unlink">
      <ActionIcon variant="default" onClick={handleClick}>
        <IconUnlink />
      </ActionIcon>
    </Tooltip>
  );
}
