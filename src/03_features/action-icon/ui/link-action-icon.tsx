import { ActionIcon, Button, TextInput, Tooltip } from "@mantine/core";
import { IconLinkPlus } from "@tabler/icons-react";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  LexicalEditor,
  TextNode,
} from "lexical";
import { useTranslation } from "react-i18next";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $createLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ContextModalProps, modals } from "@mantine/modals";

export function LinkActionIcon({
  editor,
  keyCombination,
}: {
  editor: LexicalEditor | null;
  keyCombination?: boolean;
}) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "k" || event.key === "K" || event.code === "KeyK") &&
        keyCombination !== false
      ) {
        event.preventDefault();
        handleClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const url = formData.get("url")?.toString();

    if (!url) {
      return;
    }
    if (!isValidUrl(url)) {
      return;
    }

    editor &&
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const selectedText = selection.getTextContent();

          if (selectedText.length > 0) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          } else {
            const linkNode = $createLinkNode(url);
            const textNode = new TextNode(url);
            linkNode.append(textNode);
            selection.insertNodes([linkNode]);
          }
        }
      });

    modals.closeAll();
  }
  function handleClick() {
    modals.openContextModal({
      modal: "createLinkModal",
      title: t("editor.linkModalTitle"),
      innerProps: {
        handleSubmit,
      },
    });
  }

  return (
    <>
      <Tooltip label={t("editor.link")}>
        <ActionIcon variant="default" onClick={handleClick} id="one">
          <IconLinkPlus />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

export function CreateLinkModal({
  context,
  id,
  innerProps,
}: ContextModalProps<{
  modalBody: string;
  handleSubmit(event: React.FormEvent<HTMLFormElement>): void;
}>) {
  const { t, i18n } = useTranslation();
  const [value, setVaue] = useState("");
  return (
    <>
      <form onSubmit={innerProps.handleSubmit}>
        <TextInput
          name="url"
          placeholder={t("editor.linkModalPlaceholder")}
          data-autofocus
          value={value}
          onChange={(event) => setVaue(event.target.value)}
          error={!isValidUrl(value) && t("editor.linkModalError")}
        />
        <Button fullWidth type="submit" mt="md">
          {t("editor.linkModalButton")}
        </Button>
      </form>
    </>
  );
}

const isValidUrl = (str: string) => {
  try {
    return !!new URL(str);
  } catch (_) {
    return false;
  }
};
