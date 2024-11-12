import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { templateCard, templateCardId } from "../api/types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useOutputEditor } from "src/02_widgets/output-editor/lib/context";
import { ChangeEvent, useEffect, useState } from "react";
import {
  addToSelected,
  copyOne,
  editModeOff,
  editModeOn,
  removeFromSelected,
  resetEditing,
  selectedModeOn,
  startEditing,
  templateCardsSlice,
} from "../model";
import { useRemoveMutation, useUpdateMutation } from "../api/mutations";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $parseSerializedNode,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

import classes from "./toolbar-plugin.module.css";
import { BasicActionIcon } from "src/05_shared/ui/basic-action-icon";
import {
  IconArrowBackUp,
  IconCheckbox,
  IconClipboardCopy,
  IconCopy,
  IconCornerUpRight,
  IconDeviceFloppy,
  IconDots,
  IconEdit,
  IconOutbound,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Menu,
  rem,
  Highlight,
  Button,
  ButtonGroup,
  TextInput,
  ActionIconGroup,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { handleClickCopyToClipboard } from "src/05_shared/lib/handle-click-copy-to-clipboard";

interface ToolbarCardPluginProps {
  id: templateCardId;
  card: templateCard;
}

export function ToolbarCardPlugin({ id, card }: ToolbarCardPluginProps) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [editor] = useLexicalComposerContext();
  const { editor: outputEditor } = useOutputEditor();
  const [nameState, setNameState] = useState(card.name);

  useEffect(() => {
    const removeEditableListener = editor.registerEditableListener(
      (isEditable) => {
        if (!isEditable) return;
        setTimeout(() => editor.focus());
      }
    );

    return removeEditableListener;
  }, [editor]);

  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditMode = mode === "edit";
  const isSelectedMode = mode === "select";
  const isSearchMode = mode === "search";
  const isSelected = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsSelected(state, id)
  );
  const isUnsavedChanges = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIsUnsavedChanges(state, id)
  );
  const idEditingCard = useAppSelector((state) =>
    templateCardsSlice.selectors.selectIdEditingCard(state)
  );
  const isEditing = idEditingCard === id;

  const updateMutation = useUpdateMutation();
  const removeMutation = useRemoveMutation();

  function handleClickEdit() {
    if (idEditingCard !== null) {
      console.log("modal");
      // openModal();
    }
    dispatch(startEditing(id));
    dispatch(editModeOn());
    editor.setEditable(true);
    editor.update(() => {
      const rootElement = editor.getRootElement();
      if (rootElement !== null) {
        rootElement.focus();
      }
    });
  }
  function handleClickReset() {
    setNameState(card.name);
    dispatch(resetEditing());
    dispatch(editModeOff());
    editor.setEditable(false);
    editor.setEditorState(editor.parseEditorState(card.content));
  }

  function handleClickSave() {
    updateMutation.mutate(
      {
        ...card,
        content: JSON.stringify(editor.getEditorState().toJSON()),
        name: nameState,
      },
      {
        onSuccess: () => {
          dispatch(resetEditing());
          dispatch(editModeOff());
        },
        onError: () => {
          setNameState(card.name);
        },
      }
    );
    editor.setEditable(false);
  }

  function handleClickAdd() {
    if (outputEditor) {
      outputEditor.update(() => {
        const editorStateJSON = editor.getEditorState().toJSON();
        const parsedNodes = editorStateJSON.root.children;

        const nodesToInsert = parsedNodes.map((serializedNode) => {
          return $parseSerializedNode(serializedNode);
        });

        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          selection.removeText();
          selection.insertNodes(nodesToInsert);
        }
      });
    }
  }

  function handleChecked() {
    if (isSelected) {
      dispatch(removeFromSelected(card.id));
    } else {
      dispatch(addToSelected(card.id));
    }
  }

  function handleClickSelect() {
    dispatch(selectedModeOn());
    dispatch(addToSelected(card.id));
  }

  function handleClickRemove() {
    removeMutation.mutate([card.id]);
  }

  function handleClickCopy() {
    console.log("copyOne");
    dispatch(copyOne(card.id));
  }

  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    setNameState(e.target.value);
  }

  function handleClickInfo() {
    // editor.update(() => {
    //   const markdown = $convertToMarkdownString(TRANSFORMERS);
    //   console.log(markdown);
    // });
  }

  return (
    <div className={classes.toolbar}>
      <div className={classes["command-group__left"]}>
        {isSelectedMode && (
          <>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleChecked}
            />
            <CardName name={nameState} />
          </>
        )}
        {isEditing && (
          <div className={classes["command-group__edit-mode"]}>
            <TextInput
              placeholder="Enter a name"
              value={nameState}
              onChange={handleChangeName}
              size="xs"
              className={classes["command-group__input"]}
            />
            {/* <input
              value={nameState}
              onChange={handleChangeName}
              placeholder="Enter a name"
            />
            <button onClick={handleClickSave}>
              {t("templateEditor.save")}
            </button>
            <button onClick={handleClickReset}>
              {t("templateEditor.reset")}
            </button> */}
            {/* <ButtonGroup>
              <Button
                onClick={handleClickSave}
                size="sm"
                variant="default"
                leftSection={<IconDeviceFloppy />}
              >
                {t("templateEditor.save")}
              </Button>
              <Button
                onClick={handleClickReset}
                size="sm"
                variant="default"
                leftSection={<IconArrowBackUp />}
              >
                {t("templateEditor.reset")}
              </Button>
            </ButtonGroup> */}
          </div>
        )}
        {(isReadMode || isSearchMode) && (
          <>
            <CardName name={nameState} />
          </>
        )}
        {isEditMode && !isEditing && (
          <>
            <CardName name={nameState} />
          </>
        )}
      </div>

      <div className={classes["command-group__right"]}>
        <>
          {isEditing && (
            <>
              <ActionIconGroup>
                <BasicActionIcon
                  variant="default"
                  onClick={handleClickSave}
                  icon={<IconDeviceFloppy />}
                />
                <BasicActionIcon
                  variant="default"
                  onClick={handleClickReset}
                  icon={<IconArrowBackUp />}
                />
              </ActionIconGroup>
            </>
          )}

          {(isReadMode || isSearchMode) && (
            <>
              <BasicActionIcon
                label={t("templateEditor.addToOutputEditor")}
                variant="default"
                onClick={handleClickAdd}
                icon={<IconOutbound />}
              />
              <BasicActionIcon
                label={t("templateEditor.copyToClipboard")}
                variant="default"
                onClick={() => handleClickCopyToClipboard({ editor })}
                icon={<IconCopy />}
              />
            </>
          )}
          {isReadMode && (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="default">
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label> {t("templateEditor.cardActions")}</Menu.Label>
                <Menu.Item
                  onClick={handleClickEdit}
                  leftSection={
                    <IconEdit style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  {t("templateEditor.edit")}
                </Menu.Item>
                <Menu.Item
                  onClick={handleClickSelect}
                  leftSection={
                    <IconCheckbox style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  {t("templateEditor.select")}
                </Menu.Item>
                <Menu.Item
                  onClick={handleClickCopy}
                  leftSection={
                    <IconClipboardCopy
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                >
                  {t("templateEditor.copy")}
                </Menu.Item>
                <Menu.Item
                  disabled
                  // onClick={}
                  leftSection={
                    <IconCornerUpRight
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                >
                  {t("templateEditor.move")}
                </Menu.Item>
                <Menu.Item
                  disabled
                  leftSection={
                    <IconShare style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  {t("templateEditor.share")}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label> {t("templateEditor.danger")}</Menu.Label>
                <Menu.Item
                  onClick={handleClickRemove}
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  {t("templateEditor.delete")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </>
      </div>
    </div>
  );
}

function CardName({ name }: { name: string }) {
  const searchTerm = useAppSelector((state) => state.templateCards.searchTerm);
  return (
    <Highlight highlight={searchTerm} className={classes["card-name"]}>
      {name}
    </Highlight>
  );
}
