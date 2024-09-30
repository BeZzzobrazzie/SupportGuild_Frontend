import { useCallback, useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "src/05_shared/redux";

import {
  moveTemplateCardData,
  templateCard,
  templateCardDataFromServer,
  templateCardId,
} from "../api/types";
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
import {
  useMoveMutation,
  useRemoveMutation,
  useUpdateMutation,
} from "../lib/mutations";
import {
  IconArrowBackUp,
  IconCheckbox,
  IconClipboardCopy,
  IconCopy,
  IconDots,
  IconEdit,
  IconFileX,
  IconOutbound,
  IconSquareRoundedX,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import classes from "./card.module.css";
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $parseSerializedNode,
  COMMAND_PRIORITY_NORMAL,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  EditorState,
  FOCUS_COMMAND,
  LexicalNode,
  LineBreakNode,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useOutputEditor } from "src/02_widgets/output-editor/lib/context";
import { EnterKeyPlugin } from "src/05_shared/lexical-plugins/enter-key-plugin";
import { copyToClipboard } from "@lexical/clipboard";
import { $generateHtmlFromNodes } from "@lexical/html";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { AutoLinkNode } from "@lexical/link";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { MATCHERS } from "src/05_shared/lexical-plugins/auto-link-matcher";
import { ActionIcon, Menu, rem, Tooltip } from "@mantine/core";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "src/05_shared/dnd";
import cn from "classnames/bind";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { queryClient } from "src/05_shared/api";
import { TEMPLATE_CARDS_QUERY_KEY } from "src/05_shared/query-key";
import { getTemplateCards, moveTemplateCard } from "../api/template-cards-api";

const cx = cn.bind(classes);

interface cardProps {
  id: templateCardId;
  card: templateCard;
}

const theme = {
  paragraph: classes["editor-paragraph"],
};
function onError(error: Error) {
  console.log(error);
}
export function Card({ id, card }: cardProps) {
  const dispatch = useAppDispatch();

  const initialConfig = {
    namespace: "CardEditor_" + id,
    theme,
    onError,
    editable: false,
    editorState: card.content,
    nodes: [AutoLinkNode],
  };

  const [editorState, setEditorState] = useState<EditorState>();
  function onChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  const [collected, drag] = useDrag(() => ({
    type: ItemTypes.TEMPLATE_DIVIDER,
    item: { movedCard: card },
    // collect: (monitor) => ({
    //   isDragging: !!monitor.isDragging(),
    // }),
  }));

  return (
    <>
      {card.prevCardId === null && <Divider card={card} reverse />}
      <LexicalComposer initialConfig={initialConfig}>
        <div className={classes["editor-container"]} ref={drag}>
          <ToolbarCardPlugin id={id} card={card} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className={classes["editor-content"]} />
            }
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* <HistoryPlugin /> */}
          <OnChangePlugin onChange={onChange} />
          <AutoLinkPlugin matchers={MATCHERS} />
          {/* <EnterKeyPlugin /> */}
        </div>
      </LexicalComposer>
      <Divider card={card} />
    </>
  );
}

export function Divider({
  card,
  reverse,
}: {
  card: templateCard;
  reverse?: boolean;
}) {
  const moveMutation = useMoveMutation();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.TEMPLATE_DIVIDER,

      drop: (item: { movedCard: templateCard }) => {
        moveMutation.mutate({
          movedCardId: item.movedCard.id,
          targetCardId: reverse ? null : card.id,
        });
      },
      canDrop: (item: { movedCard: templateCard }, monitor) => {
        // console.log(item.movedCard);
        if (reverse && item.movedCard.id !== card.id) {
          return true;
        } else if (reverse) {
          return false;
        }
        if (
          item.movedCard.id === card.id ||
          item.movedCard.id === card.nextCardId
        ) {
          return false;
        }
        return true;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [card]
  );

  const dividerClass = cx("divider", {
    ["divider_drop"]: isOver,
  });

  return <div className={dividerClass} ref={drop}></div>;
}

function ToolbarCardPlugin({
  id,
  card,
}: {
  id: templateCardId;
  card: templateCard;
}) {
  const dispatch = useAppDispatch();
  const [editor] = useLexicalComposerContext();
  const { editor: outputEditor } = useOutputEditor();

  useEffect(() => {
    const removeEditableListener = editor.registerEditableListener(
      (isEditable) => {
        if (!isEditable) return;
        // This is the key to make focus work.
        setTimeout(() => editor.focus());
      }
    );

    return removeEditableListener;
  }, [editor]);

  const isEditable = editor.isEditable();

  const mode = useAppSelector((state) =>
    templateCardsSlice.selectors.selectMode(state)
  );
  const isReadMode = mode === "read";
  const isEditMode = mode === "edit";
  const isSelectedMode = mode === "select";
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
    // editor.dispatchCommand(FOCUS_COMMAND, new FocusEvent('focus'))
    editor.update(() => {
      const rootElement = editor.getRootElement();
      if (rootElement !== null) {
        rootElement.focus();
      }
    });
  }
  function handleClickReset() {
    dispatch(resetEditing());
    dispatch(editModeOff());
    editor.setEditable(false);
    editor.setEditorState(editor.parseEditorState(card.content));
  }

  function handleClickSave() {
    updateMutation.mutate(
      { ...card, content: JSON.stringify(editor.getEditorState().toJSON()) },
      {
        onSuccess: () => {
          dispatch(resetEditing());
          dispatch(editModeOff());
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
  function handleClickCopyToClipboard() {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      const html = new Blob([htmlString], { type: "text/html" });
      const text = new Blob([$getRoot().getTextContent()], {
        type: "text/plain",
      });
      const item = new ClipboardItem({ "text/plain": text, "text/html": html });
      navigator.clipboard.write([item]);
    });
  }

  function handleClickInfo() {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      console.log(markdown);
    });
  }

  return (
    <div className={classes.toolbar}>
      <div className={classes["command-group"]}>
        {isSelectedMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleChecked}
          />
        )}
        {isEditing && (
          <>
            <button onClick={handleClickSave}>Save</button>
            <button onClick={handleClickReset}>Reset</button>
          </>
        )}
        {isReadMode && (
          <>
            {/* <button onClick={handleClickEdit}>Edit</button> */}
            {/* <button onClick={handleClickSelect}>Select</button> */}
            {/* <button onClick={handleClickCopy}>Copy</button> */}
            {/* <button onClick={handleClickAdd}>Add</button> */}
            {/* <button onClick={handleClickCopyToClipboard}>
              Copy to clipboard
            </button> */}
            {/* <button onClick={handleClickInfo}>Info</button> */}
            <Tooltip label="Add to output editor">
              <ActionIcon variant="default" onClick={handleClickAdd}>
                <IconOutbound />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Copy to clipboard">
              <ActionIcon
                variant="default"
                onClick={handleClickCopyToClipboard}
              >
                <IconCopy />
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </div>

      <div className={classes["command-group"]}>
        {/* {isReadMode && <button onClick={handleClickRemove}>Delete</button>} */}

        {isReadMode && (
          <Menu>
            <Menu.Target>
              <ActionIcon variant="default">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Card actions</Menu.Label>
              <Menu.Item
                onClick={handleClickEdit}
                leftSection={
                  <IconEdit style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={handleClickSelect}
                leftSection={
                  <IconCheckbox style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Select
              </Menu.Item>
              <Menu.Item
                onClick={handleClickCopy}
                leftSection={
                  <IconClipboardCopy
                    style={{ width: rem(16), height: rem(16) }}
                  />
                }
              >
                Copy card
              </Menu.Item>
              <Menu.Item
                disabled
                // onClick={}
                // leftSection={
                //   <IconClipboardCopy
                //     style={{ width: rem(16), height: rem(16) }}
                //   />
                // }
              >
                Move
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                onClick={handleClickRemove}
                color="red"
                leftSection={
                  <IconTrash style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </div>
  );
}
